import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { useAppContext } from '../../../context/appContext';
import Text from '../Text';
import useStyles from './styles';

type Props = TextInputProps & {
  label?: string;
};

const Input: React.FC<Props> = ({ label, style, ...rest }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      {!!label && <Text variant="label">{label}</Text>}
      <TextInput
        {...rest}
        placeholderTextColor={colors.TEXT.TERTIARY}
        style={[
          styles.input,
          style,
        ]}
      />
    </View>
  );
};

export default Input;
