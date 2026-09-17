import React from 'react';
import { View } from 'react-native';
import { useAppContext } from '../../../../context/appContext';
import Text from '../../../../common/ui/Text';
import { MessageComponentProps } from './messageTypes';
import useStyles from './styles';

/** System events render as a centered, muted chip. */
const SystemMessage: React.FC<MessageComponentProps> = ({ message }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  return (
    <View style={styles.systemRow}>
      <View style={styles.systemChip}>
        <Text variant="label" style={styles.systemText}>
          {message.text}
        </Text>
      </View>
    </View>
  );
};

export default SystemMessage;
