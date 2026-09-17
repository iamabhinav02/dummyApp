import moment from 'moment';
import { ConversationMessage } from '../../../../types/conversation';

/**
 * A renderable row in the timeline: either a date separator or a message with
 * grouping metadata. Precomputing this keeps the list's renderItem trivial.
 */
export type TimelineItem =
  | { kind: 'date'; id: string; label: string }
  | {
      kind: 'message';
      id: string;
      message: ConversationMessage;
      isGroupStart: boolean;
      isGroupEnd: boolean;
    };

/** Consecutive messages by the same author within this window are grouped. */
const GROUP_WINDOW_MS = 5 * 60 * 1000;

const dateLabel = (timestamp: number): string => {
  const value = moment(timestamp);
  if (value.isSame(moment(), 'day')) {
    return 'Today';
  }
  if (value.isSame(moment().subtract(1, 'day'), 'day')) {
    return 'Yesterday';
  }
  return value.format('MMMM D, YYYY');
};

const areGroupable = (a?: ConversationMessage, b?: ConversationMessage): boolean => {
  if (!a || !b) {
    return false;
  }
  return (
    a.type === b.type &&
    a.type !== 'system' &&
    moment(a.createdAt).isSame(b.createdAt, 'day') &&
    Math.abs(a.createdAt - b.createdAt) <= GROUP_WINDOW_MS
  );
};

/**
 * Transforms a chronological message list into timeline rows, inserting date
 * separators on day changes and flagging the first/last message in each group.
 */
export const buildTimeline = (messages: ConversationMessage[]): TimelineItem[] => {
  const sorted = [...messages].sort((a, b) => a.createdAt - b.createdAt);
  const items: TimelineItem[] = [];

  sorted.forEach((message, index) => {
    const previous = sorted[index - 1];
    const next = sorted[index + 1];

    const startsNewDay =
      !previous || !moment(previous.createdAt).isSame(message.createdAt, 'day');

    if (startsNewDay) {
      items.push({ kind: 'date', id: `date-${message.id}`, label: dateLabel(message.createdAt) });
    }

    items.push({
      kind: 'message',
      id: message.id,
      message,
      isGroupStart: startsNewDay || !areGroupable(previous, message),
      isGroupEnd: !areGroupable(message, next),
    });
  });

  return items;
};
