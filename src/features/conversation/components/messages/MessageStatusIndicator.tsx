import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useAppContext } from '../../../../context/appContext';
import Text from '../../../../common/ui/Text';
import { MESSAGE_STATUS } from '../../../../enums/conversation';
import { MessageDeliveryStatus } from '../../../../types/conversation';
import useStyles from './styles';

type Props = {
  status?: MessageDeliveryStatus;
  onRetry?: () => void;
};

const STATUS_LABEL: Record<MessageDeliveryStatus, string> = {
  [MESSAGE_STATUS.SENDING]: 'Sending…',
  [MESSAGE_STATUS.SENT]: 'Sent',
  [MESSAGE_STATUS.FAILED]: 'Failed to send',
};

/** Shows the delivery lifecycle of an optimistic user message. */
const MessageStatusIndicator: React.FC<Props> = ({ status, onRetry }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  if (!status) {
    return null;
  }

  return (
    <View style={styles.statusRow}>
      {status === MESSAGE_STATUS.SENDING && <ActivityIndicator size="small" color={colors.TEXT.TERTIARY} />}
      <Text variant="label" style={styles.statusText}>
        {STATUS_LABEL[status]}
      </Text>
      {status === MESSAGE_STATUS.FAILED && !!onRetry && (
        <Pressable onPress={onRetry} accessibilityRole="button">
          <Text variant="label" style={styles.retryText}>
            Retry
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default MessageStatusIndicator;
