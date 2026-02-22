import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import styles from './styles';
import { useAppContext } from '../../context/appContext';

interface Props {
  value: string;
  onChange: (value: string) => void;
  editable?: boolean;
  placeholder?: string;
}

const TextInput: React.FC<Props> = (props) => {
  const {
    editable = true,
    value,
    onChange,
    placeholder = 'Enter amount',
  } = props;

  const { colors } = useAppContext();
  const style = styles(colors);
  const textRef = React.useRef<RNTextInput>(null);

  const handleFocus = () => {
    textRef.current?.focus();
  };

  const handleBlur = () => {
    textRef.current?.blur();
  };

  return (
    <RNTextInput
      ref={textRef}
      editable={editable}
      keyboardType="decimal-pad"
      placeholder={placeholder}
      value={value}
      autoFocus={false}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChangeText={onChange}
      accessibilityLabel="amount-input"
      style={style.container}
    />
  );
};

export default TextInput;
