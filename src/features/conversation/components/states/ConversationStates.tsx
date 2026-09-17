import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useAppContext } from '../../../../context/appContext';
import Text from '../../../../common/ui/Text';
import Button from '../../../../common/ui/Button';
import useStyles from './styles';

/** Initial load spinner. */
export const LoadingState: React.FC = () => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text variant="body" style={styles.text}>
        Loading conversation…
      </Text>
    </View>
  );
};

/** Shown when there are no messages yet. */
export const EmptyState: React.FC = () => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);
  return (
    <View style={styles.container}>
      <Icon source="message-outline" size={40} color={colors.TEXT.TERTIARY} />
      <Text variant="title" style={styles.text}>
        Start your conversation.
      </Text>
      <Text variant="body" style={styles.subtitle}>
        Ask the AI astrologer anything to begin.
      </Text>
    </View>
  );
};

type ErrorProps = { onRetry: () => void };

/** Network failure state with a retry affordance. */
export const ErrorState: React.FC<ErrorProps> = ({ onRetry }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);
  return (
    <View style={styles.container}>
      <Icon source="cloud-off-outline" size={40} color={colors.TEXT.TERTIARY} />
      <Text variant="title" style={styles.text}>
        Unable to load conversation.
      </Text>
      <Button title="Retry" onPress={onRetry} />
    </View>
  );
};
