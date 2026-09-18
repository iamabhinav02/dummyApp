import moment from 'moment';
import { MESSAGE_AUTHOR, TIMELINE_ITEM_KIND } from '../../../../enums/conversation';
import { Message } from '../../../../types/conversation';

/**
 * A renderable row in the timeline: either a date separator or a message
 * reference with grouping metadata. The MESSAGE variant carries only the
 * `messageId` (not the message body) — the row self-subscribes to its message
 * so content changes (reactions, status) never rebuild this skeleton.
 */
export type TimelineItem =
  | { kind: TIMELINE_ITEM_KIND.DATE; id: string; label: string }
  | {
      kind: TIMELINE_ITEM_KIND.MESSAGE;
      id: string;
      messageId: string;
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

const areGroupable = (a?: Message, b?: Message): boolean => {
  if (!a || !b) {
    return false;
  }
  return (
    a.type === b.type &&
    a.type !== MESSAGE_AUTHOR.SYSTEM &&
    moment(a.createdAt).isSame(b.createdAt, 'day') &&
    Math.abs(a.createdAt - b.createdAt) <= GROUP_WINDOW_MS
  );
};

/**
 * Transforms the ordered messageIds into timeline rows, inserting date
 * separators on day changes and flagging the first/last message in each group.
 *
 * Reads only immutable fields (createdAt, type) via `getMessage`, so it is safe
 * to memoize on `messageOrder` alone: those fields — and therefore the skeleton
 * — change only when a message is added/removed, which is exactly when
 * `messageOrder` gets a new reference.
 */
export const buildTimelineSkeleton = (
  messageOrder: string[],
  getMessage: (id: string) => Message | undefined,
): TimelineItem[] => {
  const sorted = messageOrder
    .map(getMessage)
    .filter((message): message is Message => !!message)
    .sort((a, b) => a.createdAt - b.createdAt);

  const items: TimelineItem[] = [];

  sorted.forEach((message, index) => {
    const previous = sorted[index - 1];
    const next = sorted[index + 1];

    const startsNewDay =
      !previous || !moment(previous.createdAt).isSame(message.createdAt, 'day');

    if (startsNewDay) {
      items.push({
        kind: TIMELINE_ITEM_KIND.DATE,
        id: `date-${message.messageId}`,
        label: dateLabel(message.createdAt),
      });
    }

    items.push({
      kind: TIMELINE_ITEM_KIND.MESSAGE,
      id: message.messageId,
      messageId: message.messageId,
      isGroupStart: startsNewDay || !areGroupable(previous, message),
      isGroupEnd: !areGroupable(message, next),
    });
  });

  return items;
};
