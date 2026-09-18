import { CONVERSATION } from '../reducers/actions';
import { conversationMessagesKey, STORAGE_KEYS } from '../constants/storage';
import CommonReduxStore from '../store/commonStore';
import { mockConversationApi } from './apis/mockConversationApi';
import { AsyncStorageController } from './AsyncStorageController';
import {
  LOAD_STATUS,
  MESSAGE_AUTHOR,
  MESSAGE_STATUS,
  REACTION_TYPE,
} from '../enums/conversation';
import { DEFAULT_CONVERSATION_ID, LOCAL_USER_ID } from '../data/seed';
import {
  Conversation,
  ConversationState,
  FeedbackReason,
  Message,
  NormalizedConversation,
  Reaction,
  ReactionType,
  User,
} from '../types/conversation';

const store = () => CommonReduxStore.getInstance();

const getState = (): ConversationState =>
  store().getState().conversationReducer as ConversationState;

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const createClientRequestId = () => `req-${createId()}`;

/** LIKE/DISLIKE are mutually exclusive; setting one clears the other. */
const EXCLUSIVE_REACTIONS: ReactionType[] = [REACTION_TYPE.LIKE, REACTION_TYPE.DISLIKE];

// --- dispatch helpers -------------------------------------------------------

const setLoadStatus = (loadStatus: ConversationState['loadStatus']) => {
  store().dispatch({ type: CONVERSATION.SET_LOAD_STATUS, payload: { loadStatus } });
};

const setSnapshot = (snapshot: NormalizedConversation) => {
  store().dispatch({ type: CONVERSATION.SET_MESSAGES, payload: { snapshot } });
};

const addMessage = (message: Message) => {
  store().dispatch({ type: CONVERSATION.ADD_MESSAGE, payload: { message } });
};

const patchMessage = (messageId: string, patch: Partial<Message>) => {
  store().dispatch({ type: CONVERSATION.PATCH_MESSAGE, payload: { messageId, patch } });
};

const removeMessage = (messageId: string) => {
  store().dispatch({ type: CONVERSATION.REMOVE_MESSAGE, payload: { messageId } });
};

const dispatchAddReaction = (reaction: Reaction) => {
  store().dispatch({ type: CONVERSATION.ADD_REACTION, payload: { reaction } });
};

const dispatchRemoveReaction = (
  messageId: string,
  userId: string,
  reactionType: ReactionType,
) => {
  store().dispatch({
    type: CONVERSATION.REMOVE_REACTION,
    payload: { messageId, userId, reactionType },
  });
};

// --- read helpers -----------------------------------------------------------

const findMessage = (messageId: string): Message | undefined =>
  getState().messagesById[messageId];

const localReaction = (
  message: Message,
  reactionType: ReactionType,
): Reaction | undefined =>
  message.reactions.find(
    (r) => r.userId === LOCAL_USER_ID && r.reactionType === reactionType,
  );

// --- persistence ------------------------------------------------------------

/** Shared metadata persisted once for all conversations (no message bodies). */
type ConversationIndex = {
  usersById: Record<string, User>;
  conversationsById: Record<string, Conversation>;
  activeConversationId: string | null;
};

/** One conversation's persisted messages, stored under its own key. */
type PersistedConversationMessages = {
  messagesById: Record<string, Message>;
  messageOrder: string[];
};

/** Persist one conversation's settled messages under its own key. */
const persistConversationMessages = (
  state: ConversationState,
  conversationId: string,
) => {
  // Scope to this conversation, and drop sending/failed from BOTH map and order
  // so a rehydrated order never references a missing or in-flight message.
  const messageOrder = state.messageOrder.filter((id) => {
    const message = state.messagesById[id];
    if (!message || message.conversationId !== conversationId) {
      return false;
    }
    return (
      message.status !== MESSAGE_STATUS.SENDING &&
      message.status !== MESSAGE_STATUS.FAILED
    );
  });

  const messagesById: Record<string, Message> = {};
  messageOrder.forEach((id) => {
    messagesById[id] = state.messagesById[id];
  });

  const payload: PersistedConversationMessages = { messagesById, messageOrder };
  return AsyncStorageController.set(conversationMessagesKey(conversationId), payload);
};

/**
 * Persist the conversation. Messages live under a per-conversation key, so a
 * write to one conversation never rewrites another; a small shared index holds
 * the users + conversation records + active id. Pass a `conversationId` to
 * persist a specific conversation (defaults to the active one).
 */
const persist = (conversationId?: string) => {
  const state = getState();
  const targetId = conversationId ?? state.activeConversationId;

  const index: ConversationIndex = {
    usersById: state.usersById,
    conversationsById: state.conversationsById,
    activeConversationId: state.activeConversationId,
  };

  const writes: Promise<void>[] = [
    AsyncStorageController.set(STORAGE_KEYS.CONVERSATION_INDEX, index),
  ];
  if (targetId) {
    writes.push(persistConversationMessages(state, targetId));
  }

  return Promise.all(writes);
};

export const ConversationController = {
  /** Called on launch: restore the active conversation, otherwise load from the API. */
  async hydrate() {
    const index = await AsyncStorageController.get<ConversationIndex>(
      STORAGE_KEYS.CONVERSATION_INDEX,
    );
    const conversationId = index?.activeConversationId;

    if (index && conversationId) {
      const stored = await AsyncStorageController.get<PersistedConversationMessages>(
        conversationMessagesKey(conversationId),
      );
      if (stored && stored.messageOrder?.length) {
        setSnapshot({
          usersById: index.usersById,
          conversationsById: index.conversationsById,
          activeConversationId: conversationId,
          messagesById: stored.messagesById,
          messageOrder: stored.messageOrder,
        });
        setLoadStatus(LOAD_STATUS.READY);
        return;
      }
    }

    await this.loadInitial();
  },

  /** Fetches the conversation, driving loading -> ready / error transitions. */
  async loadInitial() {
    setLoadStatus(LOAD_STATUS.LOADING);
    try {
      const snapshot = await mockConversationApi.fetchConversation();
      setSnapshot(snapshot);
      setLoadStatus(LOAD_STATUS.READY);
      persist();
    } catch {
      setLoadStatus(LOAD_STATUS.ERROR);
    }
  },

  /** Retry the initial load after a network failure. */
  retryLoad() {
    return this.loadInitial();
  },

  /** Optimistically add a user message, then attempt delivery. */
  async sendMessage(text: string, replyToMessageId?: string | null) {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const conversationId = getState().activeConversationId ?? DEFAULT_CONVERSATION_ID;

    const optimistic: Message = {
      messageId: createId(),
      conversationId,
      senderId: LOCAL_USER_ID,
      clientRequestId: createClientRequestId(),
      type: MESSAGE_AUTHOR.USER,
      text: trimmed,
      createdAt: Date.now(),
      status: MESSAGE_STATUS.SENDING,
      reactions: [],
      recommendations: [],
      replyToMessageId: replyToMessageId ?? undefined,
    };

    addMessage(optimistic);
    await this.deliver(optimistic);
  },

  /** Retry a message that previously failed to send. */
  async retryMessage(messageId: string) {
    const message = findMessage(messageId);
    if (!message) {
      return;
    }
    patchMessage(messageId, { status: MESSAGE_STATUS.SENDING });
    await this.deliver({ ...message, status: MESSAGE_STATUS.SENDING });
  },

  /** Shared send pipeline: simulate the request, then reconcile state. */
  async deliver(message: Message) {
    try {
      const aiReply = await mockConversationApi.sendMessage(
        message.text,
        message.conversationId,
      );
      patchMessage(message.messageId, { status: MESSAGE_STATUS.SENT });
      addMessage(aiReply);
      persist();
    } catch {
      patchMessage(message.messageId, { status: MESSAGE_STATUS.FAILED });
    }
  },

  deleteMessage(messageId: string) {
    removeMessage(messageId);
    persist();
  },

  /**
   * Toggle the local user's reaction of a given type on a message. LIKE/DISLIKE
   * are mutually exclusive; toggling one off or switching clears the other.
   */
  toggleReaction(messageId: string, reactionType: ReactionType) {
    const message = findMessage(messageId);
    if (!message) {
      return;
    }

    if (localReaction(message, reactionType)) {
      dispatchRemoveReaction(messageId, LOCAL_USER_ID, reactionType);
      persist();
      return;
    }

    if (EXCLUSIVE_REACTIONS.includes(reactionType)) {
      EXCLUSIVE_REACTIONS.filter((type) => type !== reactionType).forEach((opposite) => {
        if (localReaction(message, opposite)) {
          dispatchRemoveReaction(messageId, LOCAL_USER_ID, opposite);
        }
      });
    }

    dispatchAddReaction({
      messageId,
      userId: LOCAL_USER_ID,
      reactionType,
      comments: [],
      createdAt: Date.now(),
    });
    persist();
  },

  /** Toggle a dislike reason chip, stored as a comment on the DISLIKE reaction. */
  toggleReason(messageId: string, reason: FeedbackReason) {
    const message = findMessage(messageId);
    if (!message) {
      return;
    }

    const dislike = localReaction(message, REACTION_TYPE.DISLIKE);
    if (!dislike) {
      return; // reasons only apply while a dislike is active
    }

    const hasReason = dislike.comments.includes(reason);
    const comments = hasReason
      ? dislike.comments.filter((item) => item !== reason)
      : [...dislike.comments, reason];

    dispatchAddReaction({ ...dislike, comments });
    persist();
  },
};
