import React from 'react';
import { useAppContext } from '../../../../context/appContext';
import ChatBubble from './ChatBubble';
import { MessageComponentProps } from './messageTypes';
import useStyles from './styles';

/** Left-aligned message from a human astrologer, visually distinct from the AI. */
const HumanMessage: React.FC<MessageComponentProps> = ({
  message,
  isGroupStart,
  onLongPress,
}) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  return (
    <ChatBubble
      align="left"
      showHeader={isGroupStart}
      headerIcon="account-voice"
      headerLabel="Astrologer"
      timestamp={message.createdAt}
      bubbleColor={colors.SURFACE.PRIMARY}
      textColor={colors.TEXT.PRIMARY}
      bubbleStyle={styles.humanBubble}
      replyTo={message.replyTo}
      onLongPress={onLongPress ? () => onLongPress(message) : undefined}
    >
      {message.text}
    </ChatBubble>
  );
};

export default HumanMessage;
