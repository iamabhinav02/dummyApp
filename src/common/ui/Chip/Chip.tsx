import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { useAppContext } from '../../../context/appContext';
import Text from '../Text';
import useStyles from './styles';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Compact, selectable pill — filters, tags, single-select reasons, etc. */
const Chip: React.FC<Props> = ({ label, selected = false, onPress, style }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected, style]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text variant="label" style={selected ? styles.chipTextSelected : styles.chipText}>
        {label}
      </Text>
    </Pressable>
  );
};

export default Chip;
