import React, { useCallback, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../../../context/appContext';
import { THEME_TYPE } from '../../../enums/common';
import { LOAD_STATUS } from '../../../enums/conversation';
import Text from '../../../common/ui/Text';
import { ConversationController } from '../../../controllers/ConversationController';
import {
  FeedbackReason,
  Message,
  ReactionType,
  Recommendation,
  ReplyContext,
} from '../../../types/conversation';
import ConversationTimeline from '../components/timeline/ConversationTimeline';
import Composer from '../components/composer/Composer';
import MessageActionsMenu from '../components/actions/MessageActionsMenu';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../components/states/ConversationStates';
import { copyToClipboard } from '../../../utils/common';
import { ICombinedAppState } from '../../../store';
import useStyles from './styles';

const REPLY_PREVIEW_MAX = 120;

const ConversationScreen: React.FC = () => {
  const { colors, theme, toggleTheme } = useAppContext();
  const styles = useStyles(colors);
  const insets = useSafeAreaInsets();

  // Narrow subscriptions: these references are stable across in-place message
  // patches, so a reaction never re-renders the screen.
  const loadStatus = useSelector((state: ICombinedAppState) => state.conversationReducer.loadStatus);
  const hasMessages = useSelector(
    (state: ICombinedAppState) => state.conversationReducer.messageOrder.length > 0,
  );

  const [actionTarget, setActionTarget] = useState<Message | null>(null);
  // The composer's active reply target is transient UI state, not global/redux.
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);

  // Resolve the reply preview from primitives so reacting to the target message
  // doesn't re-render the composer.
  const replyAuthor = useSelector((state: ICombinedAppState) =>
    replyTargetId ? state.conversationReducer.messagesById[replyTargetId]?.type : undefined,
  );
  const replyText = useSelector((state: ICombinedAppState) =>
    replyTargetId ? state.conversationReducer.messagesById[replyTargetId]?.text : undefined,
  );
  const reply = useMemo<ReplyContext | null>(() => {
    if (!replyTargetId || replyAuthor === undefined || replyText === undefined) {
      return null;
    }
    return {
      messageId: replyTargetId,
      author: replyAuthor,
      preview: replyText.slice(0, REPLY_PREVIEW_MAX),
    };
  }, [replyTargetId, replyAuthor, replyText]);

  const closeMenu = () => setActionTarget(null);

  const handleReply = (message: Message) => {
    setReplyTargetId(message.messageId);
    closeMenu();
  };

  const handleCopy = (message: Message) => {
    copyToClipboard(message.text);
    closeMenu();
    Alert.alert('Copied', 'Message copied to clipboard.');
  };

  const handleDelete = (message: Message) => {
    ConversationController.deleteMessage(message.messageId);
    closeMenu();
  };

  // Stable handler identities so memoized rows don't re-render on screen updates.
  const onLongPressMessage = useCallback((message: Message) => setActionTarget(message), []);
  const onRetryMessage = useCallback(
    (message: Message) => ConversationController.retryMessage(message.messageId),
    [],
  );
  const onPressRecommendation = useCallback((recommendation: Recommendation) => {
    Alert.alert(recommendation.title, `Opening the ${recommendation.type} experience.`);
  }, []);
  const onToggleReaction = useCallback(
    (messageId: string, reactionType: ReactionType) =>
      ConversationController.toggleReaction(messageId, reactionType),
    [],
  );
  const onToggleReason = useCallback(
    (messageId: string, reason: FeedbackReason) =>
      ConversationController.toggleReason(messageId, reason),
    [],
  );

  const handleSend = useCallback(
    (text: string) => {
      ConversationController.sendMessage(text, replyTargetId);
      setReplyTargetId(null);
    },
    [replyTargetId],
  );

  const renderBody = () => {
    if (loadStatus === LOAD_STATUS.LOADING || loadStatus === LOAD_STATUS.IDLE) {
      return <LoadingState />;
    }
    if (loadStatus === LOAD_STATUS.ERROR) {
      return <ErrorState onRetry={() => ConversationController.retryLoad()} />;
    }
    if (!hasMessages) {
      return <EmptyState />;
    }
    return (
      <ConversationTimeline
        onLongPress={onLongPressMessage}
        onRetry={onRetryMessage}
        onPressRecommendation={onPressRecommendation}
        onToggleReaction={onToggleReaction}
        onToggleReason={onToggleReason}
      />
    );
  };

  const showComposer = loadStatus === LOAD_STATUS.READY;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <View style={styles.headerTitleWrap}>
            <Icon source="crystal-ball" size={22} color={colors.TEXT.PRIMARY} />
            <Text variant="title">AI Astrologer</Text>
          </View>
          <Text variant="label" style={styles.subtitle}>
            AI-powered astrology chat
          </Text>
        </View>
        <Pressable
          onPress={toggleTheme}
          accessibilityRole="button"
          accessibilityLabel="Toggle theme"
        >
          <Icon
            source={theme === THEME_TYPE.LIGHT ? 'weather-night' : 'white-balance-sunny'}
            size={22}
            color={colors.TEXT.PRIMARY}
          />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        // keyboardVerticalOffset={insets.top}
      >
        <View style={styles.body}>{renderBody()}</View>

        {showComposer ? (
          <View style={[styles.composerArea, { paddingBottom: insets.bottom }]}>
            <Composer
              reply={reply}
              onSend={handleSend}
              onClearReply={() => setReplyTargetId(null)}
            />
          </View>
        ) : null}
      </KeyboardAvoidingView>

      <MessageActionsMenu
        message={actionTarget}
        onClose={closeMenu}
        onReply={handleReply}
        onCopy={handleCopy}
        onDelete={handleDelete}
      />
    </View>
  );
};

export default ConversationScreen;
