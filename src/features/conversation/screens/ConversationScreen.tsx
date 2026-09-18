import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../../../context/appContext';
import { THEME_TYPE } from '../../../enums/common';
import { LOAD_STATUS } from '../../../enums/conversation';
import Text from '../../../common/ui/Text';
import { ConversationController } from '../../../controllers/ConversationController';
import { ConversationMessage, Recommendation } from '../../../types/conversation';
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

const ConversationScreen: React.FC = () => {
  const { colors, theme, toggleTheme } = useAppContext();
  const styles = useStyles(colors);
  const insets = useSafeAreaInsets();

  const { loadStatus, messages, reply } = useSelector((state: ICombinedAppState) => state.conversationReducer);
  const [actionTarget, setActionTarget] = useState<ConversationMessage | null>(null);

  const closeMenu = () => setActionTarget(null);

  const handleReply = (message: ConversationMessage) => {
    ConversationController.setReply(message);
    closeMenu();
  };

  const handleCopy = (message: ConversationMessage) => {
    copyToClipboard(message.text);
    closeMenu();
    Alert.alert('Copied', 'Message copied to clipboard.');
  };

  const handleDelete = (message: ConversationMessage) => {
    ConversationController.deleteMessage(message.id);
    closeMenu();
  };

  const handlePressRecommendation = (recommendation: Recommendation) => {
    Alert.alert(recommendation.title, `Opening the ${recommendation.type} experience.`);
  };

  const renderBody = () => {
    if (loadStatus === LOAD_STATUS.LOADING || loadStatus === LOAD_STATUS.IDLE) {
      return <LoadingState />;
    }
    if (loadStatus === LOAD_STATUS.ERROR) {
      return <ErrorState onRetry={() => ConversationController.retryLoad()} />;
    }
    if (!messages.length) {
      return <EmptyState />;
    }
    return (
      <ConversationTimeline
        messages={messages}
        onLongPressMessage={setActionTarget}
        onRetryMessage={(message) => ConversationController.retryMessage(message.id)}
        onPressRecommendation={handlePressRecommendation}
        onSetRating={(id, rating) => ConversationController.setRating(id, rating)}
        onToggleReason={(id, reason) => ConversationController.toggleReason(id, reason)}
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
              onSend={(text) => ConversationController.sendMessage(text, reply)}
              onClearReply={() => ConversationController.clearReply()}
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
