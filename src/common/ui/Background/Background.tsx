import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useAppContext } from '../../../context/appContext';
import useStyle from './styles';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Background: React.FC<Props> = ({ children, style }) => {
  const { colors } = useAppContext();
  const styles = useStyle(colors);

  return (
    <View
      style={[
        styles.container,
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Background;
