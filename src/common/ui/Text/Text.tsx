import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useAppContext } from '../../../context/appContext';
import useStyles from './styles';

type Variant = 'heading' | 'title' | 'body' | 'label';

type Props = RNTextProps & {
  variant?: Variant;
};

const Text: React.FC<Props> = ({ variant = 'body', style, ...rest }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  return (
    <RNText
      {...rest}
      style={[
        styles.base,
        styles[variant],
        style,
      ]}
    />
  );
};

export default Text;
