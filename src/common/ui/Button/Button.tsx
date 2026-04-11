import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { useAppContext } from '../../../context/appContext';
import Text from '../Text';
import useStyles from './styles';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const Button: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: isPrimary ? colors.BUTTONS.PRIMARY : colors.BUTTONS.TERTIARY,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Text
        variant="label"
        style={{ color: isPrimary ? '#FFFFFF' : colors.TEXT.PRIMARY }}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;
