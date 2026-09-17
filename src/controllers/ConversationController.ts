import { CONVERSATION } from '../reducers/actions';
import CommonReduxStore from '../store/commonStore';
import { mockConversationApi } from './apis/mockConversationApi';
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

export const ConversationController = {
  /** Fetches the conversation, driving loading -> ready / error transitions. */
  async loadInitial() {
    setLoadStatus('loading');
    try {
      const messages = await mockConversationApi.fetchConversation();
      setMessages(messages);
      setLoadStatus('ready');
    } catch {
      setLoadStatus('error');
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
      type: 'user',
      text: trimmed,
      createdAt: Date.now(),
      status: 'sending',
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
    patchMessage(messageId, { status: 'sending' });
    await this.deliver({ ...message, status: 'sending' });
  },

  /** Shared send pipeline: simulate the request, then reconcile state. */
  async deliver(message: ConversationMessage) {
    try {
      const aiReply = await mockConversationApi.sendMessage(message.text);
      patchMessage(message.id, { status: 'sent' });
      addMessage(aiReply);
    } catch {
      patchMessage(message.id, { status: 'failed' });
    }
  },

  deleteMessage(messageId: string) {
    store().dispatch({ type: CONVERSATION.REMOVE_MESSAGE, payload: { messageId } });
  },

  /** Toggle like/dislike on an AI message. Switching away from dislike clears reasons. */
  setRating(messageId: string, rating: FeedbackRating) {
    const message = getState().messages.find((item) => item.id === messageId);
    if (!message) {
      return;
    }

    const current = message.feedback ?? { reasons: [] };
    const nextRating = current.rating === rating ? undefined : rating;
    const nextReasons = nextRating === 'dislike' ? current.reasons : [];

    patchMessage(messageId, { feedback: { rating: nextRating, reasons: nextReasons } });
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
