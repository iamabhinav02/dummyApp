import React from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Background, Button, Card, Text } from '../../../common/ui';
import { MODULES } from '../../../constants/modules';
import { ExpensesController } from '../../../controllers/ExpensesController';
import { ICombinedAppState } from '../../../store';
import ExpenseItemCard from '../components/ExpenseItemCard';
import { useExpenseSummary } from '../hooks/useExpenseSummary';
import styles from './styles';

type Props = {
  onClose: () => void;
  onAddExpense: () => void;
};

const ExpensesHomeScreen: React.FC<Props> = ({ onClose, onAddExpense }) => {
  const style = styles();
  const items = useSelector((state: ICombinedAppState) => state[MODULES.EXPENSES.reducerKey].items);
  const summary = useExpenseSummary(items);

  return (
    <Background style={style.background}>
      <View style={style.container}>
        <View style={style.header}>
          <Text variant="heading">Expense Tracker</Text>
          <Button title="Back to Hub" variant="secondary" onPress={onClose} />
        </View>

        <Card>
          <Text variant="title">Summary</Text>
          <Text variant="body">Transactions: {summary.totalItems}</Text>
          <Text variant="body">Categories: {summary.categories}</Text>
          <Text variant="body">Total spend: {summary.totalAmount.toFixed(2)}</Text>
        </Card>

        <Button title="Add expense" onPress={onAddExpense} />

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={style.listContent}
          ListEmptyComponent={<Text variant="body">No expenses added yet.</Text>}
          renderItem={({ item }) => (
            <ExpenseItemCard
              item={item}
              onRemove={(id) => {
                ExpensesController.removeExpense(id);
              }}
            />
          )}
        />
      </View>
    </Background>
  );
};

export default ExpensesHomeScreen;
