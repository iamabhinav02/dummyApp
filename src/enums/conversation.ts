/** Who authored a message in the timeline. */
export enum MESSAGE_AUTHOR {
  USER = 'user',
  AI = 'ai',
  HUMAN = 'human',
  SYSTEM = 'system',
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

export enum FEEDBACK_RATING {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

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
