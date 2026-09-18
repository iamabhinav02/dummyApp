import React from 'react';
import { useAppContext } from '../../../../context/appContext';
import ChatBubble from './ChatBubble';
import MessageStatusIndicator from './MessageStatusIndicator';
import { MessageComponentProps } from './messageTypes';

/** Right-aligned user message with delivery status + retry. */
const UserMessage: React.FC<MessageComponentProps> = ({
  message,
  replyTo,
  isGroupStart,
  onLongPress,
  onRetry,
}) => {
  const { colors } = useAppContext();

  return (
    <ChatBubble
      align="right"
      showHeader={isGroupStart}
      headerLabel="You"
      timestamp={message.createdAt}
      bubbleColor={colors.BUTTONS.PRIMARY}
      textColor={colors.TEXT.INVERSE}
      replyTo={replyTo}
      onLongPress={onLongPress ? () => onLongPress(message) : undefined}
      extras={
        <MessageStatusIndicator
          status={message.status}
          onRetry={onRetry ? () => onRetry(message) : undefined}
        />
      }
    >
      {message.text}
    </ChatBubble>
  );
};

export default UserMessage;
