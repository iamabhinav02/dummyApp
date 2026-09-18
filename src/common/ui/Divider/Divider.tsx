import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useAppContext } from '../../../context/appContext';
import Text from '../Text';
import useStyles from './styles';

type Props = {
  /** Optional centered label; omit for a plain horizontal rule. */
  label?: string;
  style?: StyleProp<ViewStyle>;
};

/** Horizontal rule with an optional centered label (e.g. a date separator). */
const Divider: React.FC<Props> = ({ label, style }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  if (!label) {
    return <View style={[styles.line, style]} />;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.rule} />
      <Text variant="label" style={styles.label}>
        {label}
      </Text>
      <View style={styles.rule} />
    </View>
  );
};

export default Divider;
