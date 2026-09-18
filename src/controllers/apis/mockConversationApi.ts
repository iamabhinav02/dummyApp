import { MESSAGE_AUTHOR, RECOMMENDATION_TYPE, SENDER_ID } from '../../enums/conversation';
import { Message, NormalizedConversation, Recommendation } from '../../types/conversation';
import { buildSeedState } from '../../data/seed';

/**
 * Mock backend for the conversation experience.
 *
 * The API surface mirrors what a real service would expose (fetch history,
 * send a message and receive an AI turn). It only simulates network latency
 * and failure — no real requests are made. Flip the flags below to exercise
 * the loading / error states on demand.
 */

/** Set true to force the initial load to fail and show the error state. */
const SIMULATE_INITIAL_LOAD_FAILURE = false;

/** Probability that sending a message fails (drives the Failed/Retry state). */
const SEND_FAILURE_RATE = 0.25;

const LATENCY_MS = { min: 600, max: 1500 };

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const randomLatency = () =>
  LATENCY_MS.min + Math.floor(Math.random() * (LATENCY_MS.max - LATENCY_MS.min));

let replyCounter = 0;

/** Canned AI follow-ups so each user turn produces a lively, varied response. */
const AI_REPLIES: { text: string; recommendations?: Recommendation[] }[] = [
  {
    text: 'The planetary alignment looks favourable. Here are a couple of paths you can explore next.',
    recommendations: [
      { id: 'r-tarot', type: RECOMMENDATION_TYPE.TAROT, title: 'Yes / No Tarot Pull' },
      { id: 'r-consult', type: RECOMMENDATION_TYPE.CONSULTATION, title: 'Talk to an Astrologer' },
    ],
  },
  {
    text: 'Mercury supports clear communication for you right now. A quick remedy can amplify it.',
    recommendations: [
      { id: 'r-remedy', type: RECOMMENDATION_TYPE.REMEDY, title: 'Wednesday Green Remedy', subtitle: 'For Mercury' },
      { id: 'r-panchang', type: RECOMMENDATION_TYPE.PANCHANG, title: "Today's Panchang" },
    ],
  },
  {
    text: 'That is a thoughtful question. Let me share what the stars suggest.',
    recommendations: [
      { id: 'r-gem', type: RECOMMENDATION_TYPE.GEMSTONE, title: 'Yellow Sapphire', subtitle: 'For Jupiter' },
      { id: 'r-article', type: RECOMMENDATION_TYPE.ARTICLE, title: 'Reading Your Birth Chart' },
      { id: 'r-promo', type: RECOMMENDATION_TYPE.PROMOTION, title: '20% off your first reading' },
    ],
  },
];

export const mockConversationApi = {
  /** Loads the existing conversation history as a normalized snapshot. */
  async fetchConversation(): Promise<NormalizedConversation> {
    await delay(randomLatency());

    if (SIMULATE_INITIAL_LOAD_FAILURE) {
      throw new Error('Unable to load conversation.');
    }

    return buildSeedState();
  },

  /**
   * Sends a user message and resolves with the AI's reply turn.
   * Rejects to simulate a transient network failure so the UI can surface
   * the Failed / Retry state.
   */
  async sendMessage(_text: string, conversationId: string): Promise<Message> {
    await delay(randomLatency());

    if (Math.random() < SEND_FAILURE_RATE) {
      throw new Error('Message failed to send.');
    }

    const reply = AI_REPLIES[replyCounter % AI_REPLIES.length];
    replyCounter += 1;

    return {
      messageId: `ai-${Date.now()}`,
      conversationId,
      senderId: SENDER_ID.AI,
      type: MESSAGE_AUTHOR.AI,
      text: reply.text,
      createdAt: Date.now(),
      reactions: [],
      recommendations: reply.recommendations ?? [],
    };
  },
};
