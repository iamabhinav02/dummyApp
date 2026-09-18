import {
  MESSAGE_AUTHOR,
  MESSAGE_STATUS,
  RECOMMENDATION_TYPE,
  SENDER_ID,
} from '../enums/conversation';
import {
  Conversation,
  Message,
  MessageAuthorType,
  NormalizedConversation,
  Recommendation,
  User,
} from '../types/conversation';

/** The single conversation this app models today. */
export const DEFAULT_CONVERSATION_ID = 'conversation:default';

/** The stable userId of the person using the app. */
export const LOCAL_USER_ID: string = SENDER_ID.LOCAL_USER;

/** Maps an author category to the stable userId of its participant. */
const SENDER_ID_BY_AUTHOR: Record<MessageAuthorType, SENDER_ID> = {
  [MESSAGE_AUTHOR.SYSTEM]: SENDER_ID.SYSTEM,
  [MESSAGE_AUTHOR.USER]: SENDER_ID.LOCAL_USER,
  [MESSAGE_AUTHOR.AI]: SENDER_ID.AI,
  [MESSAGE_AUTHOR.HUMAN]: SENDER_ID.HUMAN,
};

/** Resolve the stable senderId for an author type (used by seed, API, migration). */
export const senderIdForAuthor = (type: MessageAuthorType): string =>
  SENDER_ID_BY_AUTHOR[type] ?? SENDER_ID.SYSTEM;

/** One `User` per participant type, each with a unique, stable userId. */
export const buildSeedUsers = (): Record<string, User> => ({
  [SENDER_ID.SYSTEM]: {
    userId: SENDER_ID.SYSTEM,
    authorType: MESSAGE_AUTHOR.SYSTEM,
    displayName: 'System',
  },
  [SENDER_ID.LOCAL_USER]: {
    userId: SENDER_ID.LOCAL_USER,
    authorType: MESSAGE_AUTHOR.USER,
    displayName: 'You',
  },
  [SENDER_ID.AI]: {
    userId: SENDER_ID.AI,
    authorType: MESSAGE_AUTHOR.AI,
    displayName: 'AI Astrologer',
    icon: 'crystal-ball',
  },
  [SENDER_ID.HUMAN]: {
    userId: SENDER_ID.HUMAN,
    authorType: MESSAGE_AUTHOR.HUMAN,
    displayName: 'Astrologer',
    icon: 'account-voice',
  },
});

/** The default conversation record. */
export const buildSeedConversation = (now = Date.now()): Conversation => ({
  conversationId: DEFAULT_CONVERSATION_ID,
  title: 'AI Astrologer',
  participantIds: [
    SENDER_ID.LOCAL_USER,
    SENDER_ID.AI,
    SENDER_ID.HUMAN,
    SENDER_ID.SYSTEM,
  ],
  createdAt: now,
  updatedAt: now,
});

/**
 * Static content for the initial conversation, mirroring the assignment's mock
 * API payload. Timestamps are stamped at build time so the timeline always
 * renders relative "today" separators and grouping.
 */
type SeedMessage = {
  id: string;
  type: MessageAuthorType;
  text: string;
  status?: MESSAGE_STATUS;
  recommendations?: Recommendation[];
};

const SEED_CONTENT: SeedMessage[] = [
  {
    id: '1',
    type: MESSAGE_AUTHOR.SYSTEM,
    text: 'Your session with AI Astrologer has started.',
  },
  {
    id: '2',
    type: MESSAGE_AUTHOR.USER,
    text: 'Can you tell me about my career this year?',
    status: MESSAGE_STATUS.SENT,
  },
  {
    id: '3',
    type: MESSAGE_AUTHOR.AI,
    text: 'I can already see a strong Saturn influence in your chart. Based on this, here are a few recommendations that may help you.',
    recommendations: [
      { id: '1', type: RECOMMENDATION_TYPE.GEMSTONE, title: 'Blue Sapphire', subtitle: 'Recommended for Saturn' },
      { id: '2', type: RECOMMENDATION_TYPE.TAROT, title: 'Career Tarot Reading' },
      { id: '3', type: RECOMMENDATION_TYPE.CONSULTATION, title: 'Talk to an Astrologer' },
      { id: '4', type: RECOMMENDATION_TYPE.ARTICLE, title: 'Understanding Saturn Mahadasha' },
    ],
  },
  {
    id: '4',
    type: MESSAGE_AUTHOR.HUMAN,
    text: 'I also recommend focusing on your upcoming Jupiter transit.',
  },
];

/**
 * Returns a fresh, normalized seed conversation with monotonically increasing
 * timestamps ending "now", so the newest message sits at the bottom.
 */
export const buildSeedState = (): NormalizedConversation => {
  const now = Date.now();
  const step = 2 * 60 * 1000; // 2 minutes between messages
  const total = SEED_CONTENT.length;

  const messagesById: Record<string, Message> = {};
  const messageOrder: string[] = [];

  SEED_CONTENT.forEach((seed, index) => {
    const message: Message = {
      messageId: seed.id,
      conversationId: DEFAULT_CONVERSATION_ID,
      senderId: senderIdForAuthor(seed.type),
      type: seed.type,
      text: seed.text,
      createdAt: now - (total - 1 - index) * step,
      status: seed.status,
      reactions: [],
      recommendations: seed.recommendations ?? [],
    };
    messagesById[message.messageId] = message;
    messageOrder.push(message.messageId);
  });

  return {
    usersById: buildSeedUsers(),
    conversationsById: { [DEFAULT_CONVERSATION_ID]: buildSeedConversation(now) },
    activeConversationId: DEFAULT_CONVERSATION_ID,
    messagesById,
    messageOrder,
  };
};
