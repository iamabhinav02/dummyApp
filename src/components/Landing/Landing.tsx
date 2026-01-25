import React from 'react';
import { View, Text, Button } from 'react-native';
import {  useSelector } from 'react-redux';
import { ICombinedAppState } from '../../store';
import CounterController from '../../controllers/CounterController';
import styles from './styles';

const Landing: React.FC = () => {
  const { count } = useSelector((selector: ICombinedAppState) => selector.counterReducer);

  const handleIncrement = () => {
    CounterController.increment(1);
  };

  const handleDecrement = () => {
    CounterController.decrement(1);
  };

  return (
    <View style={styles.container}>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={handleIncrement} />
      <Button title="Decrement" onPress={handleDecrement} />
    </View>
  );
};

export default Landing;
