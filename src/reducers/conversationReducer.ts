import { IActionState } from '../types/actions';
import { CONVERSATION } from './actions';
import { LOAD_STATUS } from '../enums/conversation';
import { ConversationActionPayload, ConversationState } from '../types/conversation';

const initialState: ConversationState = {
  loadStatus: LOAD_STATUS.IDLE,
  messages: [],
  reply: null,
};

export const conversationReducer = (
  state = initialState,
  action: IActionState<ConversationActionPayload>,
): ConversationState => {
  switch (action.type) {
    case CONVERSATION.SET_LOAD_STATUS:
      return {
        ...state,
        loadStatus: action.payload?.loadStatus ?? state.loadStatus,
      };

    case CONVERSATION.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload?.messages ?? [],
      };

    case CONVERSATION.ADD_MESSAGE:
      if (!action.payload?.message) {
        return state;
      }
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
      };

    case CONVERSATION.PATCH_MESSAGE: {
      const { messageId, patch } = action.payload ?? {};
      if (!messageId || !patch) {
        return state;
      }
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === messageId ? { ...message, ...patch } : message,
        ),
      };
    }

    case CONVERSATION.REMOVE_MESSAGE:
      if (!action.payload?.messageId) {
        return state;
      }
      return {
        ...state,
        messages: state.messages.filter(
          (message) => message.id !== action.payload?.messageId,
        ),
      };

    case CONVERSATION.SET_REPLY:
      return {
        ...state,
        reply: action.payload?.reply ?? null,
      };

    default:
      return state;
  }
};
