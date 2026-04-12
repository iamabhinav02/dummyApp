import React from 'react';
import { View } from 'react-native';
import { Background, Button, Card, Text } from '../../../common/ui';
import { IExpenseItem } from '../../../types/reducers';
import styles from './styles';

type Props = {
  item: IExpenseItem;
  onRemove: (id: string) => void;
};

const ExpenseItemCard: React.FC<Props> = ({ item, onRemove }) => {
  const style = styles();

  return (
    <Background>
      <Card style={style.card}>
        <View style={style.header}>
          <Text variant="title">{item.title}</Text>
          <Text variant="label">{item.amount.toFixed(2)}</Text>
        </View>
        <Text variant="body">Category: {item.category}</Text>
        <Text variant="body">{new Date(item.timestamp).toLocaleString()}</Text>
        <Button title="Delete" variant="secondary" onPress={() => onRemove(item.id)} />
      </Card>
    </Background>
  );
};

export default ExpenseItemCard;
