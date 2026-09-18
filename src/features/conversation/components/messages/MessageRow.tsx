import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ICombinedAppState } from '../../../../store';
import { ReplyContext } from '../../../../types/conversation';
import { getMessageComponent } from './messageRegistry';
import { MessageRowHandlers } from './messageTypes';

const REPLY_PREVIEW_MAX = 120;

type Props = MessageRowHandlers & {
  messageId: string;
  isGroupStart: boolean;
  isGroupEnd: boolean;
};

/**
 * Self-subscribing timeline row. It selects ONLY its own message by id, so a
 * reaction/status change on another message never re-renders it, and a change
 * to this message re-renders only this row. Memoized on its primitive props so
 * a parent re-render (e.g. list scroll) doesn't cascade.
 */
const MessageRow: React.FC<Props> = ({
  messageId,
  isGroupStart,
  isGroupEnd,
  ...handlers
}) => {
  const message = useSelector(
    (state: ICombinedAppState) => state.conversationReducer.messagesById[messageId],
  );

  // Resolve the replied-to preview from PRIMITIVES so reacting to that message
  // doesn't re-render this row.
  const replyToMessageId = message?.replyToMessageId;
  const replyAuthor = useSelector((state: ICombinedAppState) =>
    replyToMessageId
      ? state.conversationReducer.messagesById[replyToMessageId]?.type
      : undefined,
  );
  const replyText = useSelector((state: ICombinedAppState) =>
    replyToMessageId
      ? state.conversationReducer.messagesById[replyToMessageId]?.text
      : undefined,
  );

  const replyTo = useMemo<ReplyContext | undefined>(() => {
    if (!replyToMessageId || replyAuthor === undefined || replyText === undefined) {
      return undefined;
    }
    return {
      messageId: replyToMessageId,
      author: replyAuthor,
      preview: replyText.slice(0, REPLY_PREVIEW_MAX),
    };
  }, [replyToMessageId, replyAuthor, replyText]);

  if (!message) {
    return null; // guards the frame between REMOVE_MESSAGE and the skeleton drop
  }

  const Component = getMessageComponent(message.type);
  return (
    <Component
      message={message}
      replyTo={replyTo}
      isGroupStart={isGroupStart}
      isGroupEnd={isGroupEnd}
      {...handlers}
    />
  );
};

export default React.memo(MessageRow);
