import React from 'react';
import { View, Text, Button } from 'react-native';
import {  useSelector } from 'react-redux';
import { ICombinedAppState } from '../../store';
import CounterController from '../../controllers/CounterController';
import { useAppContext } from '../../context/appContext';
import styles from './styles';

const Landing: React.FC = () => {
  const { toggleTheme, colors } = useAppContext();
  const { count } = useSelector((selector: ICombinedAppState) => selector.counterReducer);

  const style = styles(colors);

  const handleIncrement = () => {
    CounterController.increment(1);
  };

  const handleDecrement = () => {
    CounterController.decrement(1);
  };

  return (
    <View style={style.container}>
      <Text style={style.text}>Count: {count}</Text>
      <Button title="Increment" onPress={handleIncrement} />
      <Button title="Decrement" onPress={handleDecrement} />
      <Button title="Change theme" onPress={toggleTheme} />
    </View>
  );
};

export default Landing;
