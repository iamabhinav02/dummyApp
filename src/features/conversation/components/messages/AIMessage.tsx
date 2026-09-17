import React from 'react';
import { useAppContext } from '../../../../context/appContext';
import ChatBubble from './ChatBubble';
import FeedbackBar from './FeedbackBar';
import RecommendationCarousel from '../recommendations/RecommendationCarousel';
import { MessageComponentProps } from './messageTypes';

/** Left-aligned AI message carrying recommendations + feedback controls. */
const AIMessage: React.FC<MessageComponentProps> = ({
  message,
  isGroupStart,
  onLongPress,
  onPressRecommendation,
  onSetRating,
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
        feedback={message.feedback}
        onSetRating={(rating) => onSetRating?.(message.id, rating)}
        onToggleReason={(reason) => onToggleReason?.(message.id, reason)}
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
      replyTo={message.replyTo}
      onLongPress={onLongPress ? () => onLongPress(message) : undefined}
      extras={extras}
    >
      {message.text}
    </ChatBubble>
  );
};

export default AIMessage;
