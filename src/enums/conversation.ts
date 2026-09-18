/** Who authored a message in the timeline. */
export enum MESSAGE_AUTHOR {
  USER = 'user',
  AI = 'ai',
  HUMAN = 'human',
  SYSTEM = 'system',
}

/**
 * Stable, unique identity per type of participant. Each value is the `userId`
 * of exactly one `User` in `usersById`, so identity survives re-renders,
 * persistence, and future multi-conversation support.
 */
export enum SENDER_ID {
  SYSTEM = 'system',
  AI = 'ai',
  HUMAN = 'human',
  LOCAL_USER = 'local-user',
}

/**
 * Reaction experiences a user can attach to a message. LIKE/DISLIKE are
 * mutually exclusive and supersede the old like/dislike feedback rating; the
 * set is open-ended so new reactions can be added without reshaping the model.
 */
export enum REACTION_TYPE {
  LIKE = 'like',
  DISLIKE = 'dislike',
  LOVE = 'love',
  INSIGHTFUL = 'insightful',
}

/** Delivery lifecycle for optimistic (user-sent) messages. */
export enum MESSAGE_STATUS {
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'failed',
}

/** Status of the initial conversation load (loading / empty / error handling). */
export enum LOAD_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

/** Reason chips shown for a DISLIKE reaction; stored as its `comments`. */
export enum FEEDBACK_REASON {
  INACCURATE = 'inaccurate',
  TOO_GENERIC = 'too_generic',
  DIDNT_HELP = 'didnt_help',
  TOO_LONG = 'too_long',
}

/** Well-known recommendation experiences with a dedicated renderer. */
export enum RECOMMENDATION_TYPE {
  GEMSTONE = 'gemstone',
  TAROT = 'tarot',
  CONSULTATION = 'consultation',
  ARTICLE = 'article',
  PROMOTION = 'promotion',
  REMEDY = 'remedy',
  PANCHANG = 'panchang',
}

/** Row variants rendered in the conversation timeline. */
export enum TIMELINE_ITEM_KIND {
  DATE = 'date',
  MESSAGE = 'message',
}
