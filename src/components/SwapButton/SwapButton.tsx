import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Icon from '@react-native-vector-icons/material-design-icons';
import { useAppContext } from '../../context/appContext';
import styles from './styles';

interface Props {
  onPress: () => void;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SwapButton: React.FC<Props> = ({
  onPress,
  disabled,
}) => {
  const { colors } = useAppContext();
  const style = styles(colors);

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const handlePress = useCallback(() => {
    if (disabled) {
      return;
    }

    rotation.value = withTiming(
      rotation.value + 180,
      {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      }
    );

    onPress();
  }, [disabled, onPress, rotation]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        style.button,
        animatedStyle,
        { opacity: disabled ? 0.65 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Swap currencies"
    >
      <Icon
        name="swap-vertical"
        size={22}
        color={colors.BUTTONS.PRIMARY}
      />
    </AnimatedPressable>
  );
};

export default SwapButton;
