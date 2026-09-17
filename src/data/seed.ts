import { ConversationMessage } from '../types/conversation';

/**
 * Static content for the initial conversation, mirroring the assignment's mock
 * API payload. Timestamps are stamped at fetch time (see buildSeedConversation)
 * so the timeline always renders relative "today" separators and grouping.
 */
const SEED_CONTENT: Omit<ConversationMessage, 'createdAt'>[] = [
  {
    id: '1',
    type: 'system',
    text: 'Your session with AI Astrologer has started.',
  },
  {
    id: '2',
    type: 'user',
    text: 'Can you tell me about my career this year?',
    status: 'sent',
  },
  {
    id: '3',
    type: 'ai',
    text: 'I can already see a strong Saturn influence in your chart. Based on this, here are a few recommendations that may help you.',
    recommendations: [
      { id: '1', type: 'gemstone', title: 'Blue Sapphire', subtitle: 'Recommended for Saturn' },
      { id: '2', type: 'tarot', title: 'Career Tarot Reading' },
      { id: '3', type: 'consultation', title: 'Talk to an Astrologer' },
      { id: '4', type: 'article', title: 'Understanding Saturn Mahadasha' },
    ],
  },
  {
    id: '4',
    type: 'human',
    text: 'I also recommend focusing on your upcoming Jupiter transit.',
  },
];

/**
 * Returns a fresh copy of the seed conversation with monotonically increasing
 * timestamps ending "now", so the newest message sits at the bottom.
 */
export const buildSeedConversation = (): ConversationMessage[] => {
  const now = Date.now();
  const step = 2 * 60 * 1000; // 2 minutes between messages
  const total = SEED_CONTENT.length;

  return SEED_CONTENT.map((message, index) => ({
    ...message,
    createdAt: now - (total - 1 - index) * step,
  }));
};
