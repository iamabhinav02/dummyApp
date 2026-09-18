import { IActionState } from '../types/actions';
import { CONVERSATION } from './actions';
import { LOAD_STATUS } from '../enums/conversation';
import { ConversationActionPayload, ConversationState } from '../types/conversation';

const initialState: ConversationState = {
  loadStatus: LOAD_STATUS.IDLE,
  usersById: {},
  conversationsById: {},
  activeConversationId: null,
  messagesById: {},
  messageOrder: [],
};

/**
 * Normalized conversation reducer.
 *
 * Invariant that powers granular re-renders: PATCH_MESSAGE / ADD_REACTION /
 * REMOVE_REACTION return the SAME `messageOrder` array reference and replace
 * only the one changed entry in `messagesById`. A component subscribing to
 * `messageOrder` therefore skips re-render (react-redux `===` bail-out) while
 * only the subscriber to that one `messagesById[id]` re-renders.
 */
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

    case CONVERSATION.SET_MESSAGES: {
      const snapshot = action.payload?.snapshot;
      if (!snapshot) {
        return state;
      }
      return {
        ...state,
        usersById: snapshot.usersById,
        conversationsById: snapshot.conversationsById,
        activeConversationId: snapshot.activeConversationId,
        messagesById: snapshot.messagesById,
        messageOrder: snapshot.messageOrder,
      };
    }

    case CONVERSATION.ADD_MESSAGE: {
      const message = action.payload?.message;
      if (!message || state.messagesById[message.messageId]) {
        // Ignore missing or already-present ids (idempotent on retry).
        return state;
      }
      return {
        ...state,
        messagesById: { ...state.messagesById, [message.messageId]: message },
        messageOrder: [...state.messageOrder, message.messageId],
      };
    }

    case CONVERSATION.PATCH_MESSAGE: {
      const { messageId, patch } = action.payload ?? {};
      const existing = messageId ? state.messagesById[messageId] : undefined;
      if (!existing || !patch) {
        return state;
      }
      return {
        ...state,
        messagesById: {
          ...state.messagesById,
          [messageId as string]: { ...existing, ...patch },
        },
        messageOrder: state.messageOrder, // SAME REFERENCE — list must not re-render
      };
    }

    case CONVERSATION.REMOVE_MESSAGE: {
      const { messageId } = action.payload ?? {};
      if (!messageId || !state.messagesById[messageId]) {
        return state;
      }
      const messagesById = { ...state.messagesById };
      delete messagesById[messageId];
      return {
        ...state,
        messagesById,
        messageOrder: state.messageOrder.filter((id) => id !== messageId),
      };
    }

    case CONVERSATION.ADD_REACTION: {
      const reaction = action.payload?.reaction;
      const existing = reaction ? state.messagesById[reaction.messageId] : undefined;
      if (!reaction || !existing) {
        return state;
      }
      // Toggle-safe: replace any existing (userId, reactionType) for this user.
      const reactions = [
        ...existing.reactions.filter(
          (r) => !(r.userId === reaction.userId && r.reactionType === reaction.reactionType),
        ),
        reaction,
      ];
      return {
        ...state,
        messagesById: {
          ...state.messagesById,
          [reaction.messageId]: { ...existing, reactions },
        },
        messageOrder: state.messageOrder, // SAME REFERENCE
      };
    }

    case CONVERSATION.REMOVE_REACTION: {
      const { messageId, userId, reactionType } = action.payload ?? {};
      const existing = messageId ? state.messagesById[messageId] : undefined;
      if (!existing) {
        return state;
      }
      const reactions = existing.reactions.filter(
        (r) => !(r.userId === userId && r.reactionType === reactionType),
      );
      if (reactions.length === existing.reactions.length) {
        return state; // nothing removed
      }
      return {
        ...state,
        messagesById: {
          ...state.messagesById,
          [messageId as string]: { ...existing, reactions },
        },
        messageOrder: state.messageOrder, // SAME REFERENCE
      };
    }

    default:
      return state;
  }
};
