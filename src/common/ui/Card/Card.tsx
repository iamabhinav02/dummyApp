import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { useAppContext } from '../../../context/appContext';
import useStyles from './styles';

type Props = ViewProps & {
  style?: StyleProp<ViewStyle>;
};

const Card: React.FC<Props> = ({ style, ...rest }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  return (
    <View
      {...rest}
      style={[
        styles.card,
        style,
      ]}
    />
  );
};

export default Card;
