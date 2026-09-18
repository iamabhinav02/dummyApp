import React, { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { TIMELINE_ITEM_KIND } from '../../../../enums/conversation';
import { useAppContext } from '../../../../context/appContext';
import {
  ConversationMessage,
  FeedbackRating,
  FeedbackReason,
  Recommendation,
} from '../../../../types/conversation';
import MessageRow from '../messages/MessageRow';
import DateSeparator from './DateSeparator';
import { buildTimeline, TimelineItem } from './timelineBuilder';
import useStyles from './styles';

type Props = {
  messages: ConversationMessage[];
  onLongPressMessage: (message: ConversationMessage) => void;
  onRetryMessage: (message: ConversationMessage) => void;
  onPressRecommendation: (recommendation: Recommendation) => void;
  onSetRating: (messageId: string, rating: FeedbackRating) => void;
  onToggleReason: (messageId: string, reason: FeedbackReason) => void;
};

/**
 * Virtualized conversation timeline. Uses FlashList's chat-oriented
 * maintain-visible-content-position to render from the bottom and auto-scroll
 * to the newest message, with a manual scrollToEnd as a guarantee on send.
 */
const ConversationTimeline: React.FC<Props> = ({
  messages,
  onLongPressMessage,
  onRetryMessage,
  onPressRecommendation,
  onSetRating,
  onToggleReason,
}) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);
  const listRef = useRef<FlashListRef<TimelineItem>>(null);
  const previousCount = useRef(messages.length);

  const items = useMemo(() => buildTimeline(messages), [messages]);

  React.useEffect(() => {
    if (messages.length > previousCount.current) {
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
    previousCount.current = messages.length;
  }, [messages.length]);

  const renderItem = useCallback(
    ({ item }: { item: TimelineItem }) => {
      if (item.kind === TIMELINE_ITEM_KIND.DATE) {
        return <DateSeparator label={item.label} />;
      }

      return (
        <View style={item.isGroupStart ? styles.rowGroupStart : styles.rowGrouped}>
          <MessageRow
            message={item.message}
            isGroupStart={item.isGroupStart}
            isGroupEnd={item.isGroupEnd}
            onLongPress={onLongPressMessage}
            onRetry={onRetryMessage}
            onPressRecommendation={onPressRecommendation}
            onSetRating={onSetRating}
            onToggleReason={onToggleReason}
          />
        </View>
      );
    },
    [
      styles,
      onLongPressMessage,
      onRetryMessage,
      onPressRecommendation,
      onSetRating,
      onToggleReason,
    ],
  );

  return (
    <FlashList
      ref={listRef}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      getItemType={(item) => item.kind}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      maintainVisibleContentPosition={{
        startRenderingFromBottom: true,
        autoscrollToBottomThreshold: 0.2,
      }}
    />
  );
};

export default ConversationTimeline;
