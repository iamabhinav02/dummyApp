import React from 'react';
import { View } from 'react-native';
import { useAppContext } from '../../../../context/appContext';
import Text from '../../../../common/ui/Text';
import useStyles from './styles';

type Props = { label: string };

/** Centered date divider between message groups on different days. */
const DateSeparator: React.FC<Props> = ({ label }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  return (
    <View style={styles.separator}>
      <View style={styles.separatorLine} />
      <Text variant="label" style={styles.separatorLabel}>
        {label}
      </Text>
      <View style={styles.separatorLine} />
    </View>
  );
};

export default DateSeparator;
