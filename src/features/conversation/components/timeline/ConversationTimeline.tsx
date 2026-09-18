import React, { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useSelector } from 'react-redux';
import { TIMELINE_ITEM_KIND } from '../../../../enums/conversation';
import { useAppContext } from '../../../../context/appContext';
import { ICombinedAppState } from '../../../../store';
import CommonReduxStore from '../../../../store/commonStore';
import { MessageRowHandlers } from '../messages/messageTypes';
import MessageRow from '../messages/MessageRow';
import DateSeparator from './DateSeparator';
import { buildTimelineSkeleton, TimelineItem } from './timelineBuilder';
import useStyles from './styles';

type Props = MessageRowHandlers;

/**
 * Virtualized conversation timeline. Subscribes ONLY to `messageOrder` (stable
 * across in-place message patches), derives the row skeleton from it, and lets
 * each row self-subscribe to its own message — so a reaction re-renders one row,
 * not the whole list. Uses FlashList's chat-oriented maintain-visible-content-
 * position to render from the bottom, with a manual scrollToEnd on new messages.
 */
const ConversationTimeline: React.FC<Props> = (handlers) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);
  const listRef = useRef<FlashListRef<TimelineItem>>(null);

  const messageOrder = useSelector(
    (state: ICombinedAppState) => state.conversationReducer.messageOrder,
  );
  const previousCount = useRef(messageOrder.length);

  // Keyed on `messageOrder` only: grouping/date fields are immutable, so the
  // skeleton changes exactly when messages are added/removed. Reading the
  // messages from the singleton snapshot (not a subscribing selector) keeps
  // reactions from re-rendering the timeline.
  const items = useMemo(
    () =>
      buildTimelineSkeleton(
        messageOrder,
        (id) => CommonReduxStore.getInstance().getState().conversationReducer.messagesById[id],
      ),
    [messageOrder],
  );

  React.useEffect(() => {
    if (messageOrder.length > previousCount.current) {
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
    previousCount.current = messageOrder.length;
  }, [messageOrder.length]);

  const renderItem = useCallback(
    ({ item }: { item: TimelineItem }) => {
      if (item.kind === TIMELINE_ITEM_KIND.DATE) {
        return <DateSeparator label={item.label} />;
      }

      return (
        <View style={item.isGroupStart ? styles.rowGroupStart : styles.rowGrouped}>
          <MessageRow
            messageId={item.messageId}
            isGroupStart={item.isGroupStart}
            isGroupEnd={item.isGroupEnd}
            {...handlers}
          />
        </View>
      );
    },
    [styles, handlers],
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
