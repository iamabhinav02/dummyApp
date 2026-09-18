import React from 'react';
import { useAppContext } from '../../../../context/appContext';
import { LOCAL_USER_ID } from '../../../../data/seed';
import ChatBubble from './ChatBubble';
import FeedbackBar from './FeedbackBar';
import RecommendationCarousel from '../recommendations/RecommendationCarousel';
import { MessageComponentProps } from './messageTypes';

/** Left-aligned AI message carrying recommendations + reaction controls. */
const AIMessage: React.FC<MessageComponentProps> = ({
  message,
  replyTo,
  isGroupStart,
  onLongPress,
  onPressRecommendation,
  onToggleReaction,
  onToggleReason,
}) => {
  const { colors } = useAppContext();

  const extras = (
    <>
      {!!message.recommendations?.length && (
        <RecommendationCarousel
          recommendations={message.recommendations}
          onPressCard={onPressRecommendation}
        />
      )}
      <FeedbackBar
        reactions={message.reactions}
        localUserId={LOCAL_USER_ID}
        onToggleReaction={(reactionType) => onToggleReaction?.(message.messageId, reactionType)}
        onToggleReason={(reason) => onToggleReason?.(message.messageId, reason)}
      />
    </>
  );

  return (
    <ChatBubble
      align="left"
      showHeader={isGroupStart}
      headerIcon="crystal-ball"
      headerLabel="AI Astrologer"
      timestamp={message.createdAt}
      bubbleColor={colors.SURFACE.SECONDARY}
      textColor={colors.TEXT.PRIMARY}
      replyTo={replyTo}
      onLongPress={onLongPress ? () => onLongPress(message) : undefined}
      extras={extras}
    >
      {message.text}
    </ChatBubble>
  );
};

export default AIMessage;
