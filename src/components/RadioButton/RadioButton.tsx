import React from 'react';
import { Pressable, Text, View } from 'react-native';
import styles from './styles';
import { useAppContext } from '../../context/appContext';

const RadioButton = ({ selected, label, handleSelect }: { selected: boolean, label: string, handleSelect: () => void }) => {
  const { colors } = useAppContext();
  const style = styles(colors);

  return (
    <Pressable
      onPress={handleSelect}
      style={style.option}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View style={style.radioOuter}>
        {selected && <View style={style.radioInner} />}
      </View>
      <Text style={style.optionText}>{label}</Text>
    </Pressable>
  );
};

export default RadioButton;
