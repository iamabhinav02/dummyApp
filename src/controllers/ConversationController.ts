import { CONVERSATION } from '../reducers/actions';
import { STORAGE_KEYS } from '../constants/storage';
import CommonReduxStore from '../store/commonStore';
import { mockConversationApi } from './apis/mockConversationApi';
import { AsyncStorageController } from './AsyncStorageController';
import {
  FEEDBACK_RATING,
  LOAD_STATUS,
  MESSAGE_AUTHOR,
  MESSAGE_STATUS,
} from '../enums/conversation';
import {
  ConversationMessage,
  ConversationState,
  FeedbackRating,
  FeedbackReason,
  ReplyContext,
} from '../types/conversation';

const REPLY_PREVIEW_MAX = 120;

const store = () => CommonReduxStore.getInstance();

const getState = (): ConversationState =>
  store().getState().conversationReducer as ConversationState;

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const setLoadStatus = (loadStatus: ConversationState['loadStatus']) => {
  store().dispatch({ type: CONVERSATION.SET_LOAD_STATUS, payload: { loadStatus } });
};

const setMessages = (messages: ConversationMessage[]) => {
  store().dispatch({ type: CONVERSATION.SET_MESSAGES, payload: { messages } });
};

const addMessage = (message: ConversationMessage) => {
  store().dispatch({ type: CONVERSATION.ADD_MESSAGE, payload: { message } });
};

const patchMessage = (messageId: string, patch: Partial<ConversationMessage>) => {
  store().dispatch({ type: CONVERSATION.PATCH_MESSAGE, payload: { messageId, patch } });
};

/**
 * Persist the conversation, keeping only settled messages so `sending`/`failed`
 * drafts never rehydrate on the next launch.
 */
const persist = () => {
  const settled = getState().messages.filter(
    (message) => message.status !== MESSAGE_STATUS.SENDING && message.status !== MESSAGE_STATUS.FAILED,
  );
  return AsyncStorageController.set(STORAGE_KEYS.CONVERSATION_MESSAGES, settled);
};

export const ConversationController = {
  /** Called on launch: restore persisted history, otherwise load from the API. */
  async hydrate() {
    const stored = await AsyncStorageController.get<ConversationMessage[]>(
      STORAGE_KEYS.CONVERSATION_MESSAGES,
    );

    if (stored && stored.length) {
      setMessages(stored);
      setLoadStatus(LOAD_STATUS.READY);
      return;
    }

    await this.loadInitial();
  },

  /** Fetches the conversation, driving loading -> ready / error transitions. */
  async loadInitial() {
    setLoadStatus(LOAD_STATUS.LOADING);
    try {
      const messages = await mockConversationApi.fetchConversation();
      setMessages(messages);
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
  async sendMessage(text: string, replyTo?: ReplyContext | null) {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const optimistic: ConversationMessage = {
      id: createId(),
      type: MESSAGE_AUTHOR.USER,
      text: trimmed,
      createdAt: Date.now(),
      status: MESSAGE_STATUS.SENDING,
      replyTo: replyTo ?? undefined,
    };

    addMessage(optimistic);
    this.clearReply();
    await this.deliver(optimistic);
  },

  /** Retry a message that previously failed to send. */
  async retryMessage(messageId: string) {
    const message = getState().messages.find((item) => item.id === messageId);
    if (!message) {
      return;
    }
    patchMessage(messageId, { status: MESSAGE_STATUS.SENDING });
    await this.deliver({ ...message, status: MESSAGE_STATUS.SENDING });
  },

  /** Shared send pipeline: simulate the request, then reconcile state. */
  async deliver(message: ConversationMessage) {
    try {
      const aiReply = await mockConversationApi.sendMessage(message.text);
      patchMessage(message.id, { status: MESSAGE_STATUS.SENT });
      addMessage(aiReply);
      persist();
    } catch {
      patchMessage(message.id, { status: MESSAGE_STATUS.FAILED });
    }
  },

  deleteMessage(messageId: string) {
    store().dispatch({ type: CONVERSATION.REMOVE_MESSAGE, payload: { messageId } });
    persist();
  },

  /** Toggle like/dislike on an AI message. Switching away from dislike clears reasons. */
  setRating(messageId: string, rating: FeedbackRating) {
    const message = getState().messages.find((item) => item.id === messageId);
    if (!message) {
      return;
    }

    const current = message.feedback ?? { reasons: [] };
    const nextRating = current.rating === rating ? undefined : rating;
    const nextReasons = nextRating === FEEDBACK_RATING.DISLIKE ? current.reasons : [];

    patchMessage(messageId, { feedback: { rating: nextRating, reasons: nextReasons } });
    persist();
  },

  /** Toggle a dislike reason chip. */
  toggleReason(messageId: string, reason: FeedbackReason) {
    const message = getState().messages.find((item) => item.id === messageId);
    if (!message) {
      return;
    }

    const current = message.feedback ?? { reasons: [] };
    const hasReason = current.reasons.includes(reason);
    const nextReasons = hasReason
      ? current.reasons.filter((item) => item !== reason)
      : [...current.reasons, reason];

    patchMessage(messageId, { feedback: { ...current, reasons: nextReasons } });
    persist();
  },

  /** Set the active reply target shown above the composer. */
  setReply(message: ConversationMessage) {
    const reply: ReplyContext = {
      messageId: message.id,
      author: message.type,
      preview: message.text.slice(0, REPLY_PREVIEW_MAX),
    };
    store().dispatch({ type: CONVERSATION.SET_REPLY, payload: { reply } });
  },

  clearReply() {
    store().dispatch({ type: CONVERSATION.SET_REPLY, payload: { reply: null } });
  },
};
