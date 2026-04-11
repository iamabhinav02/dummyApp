import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Background, Button, Input, Text } from '../../../common/ui';
import { ExpensesController } from '../../../controllers/ExpensesController';
import styles from './styles';

type Props = {
  onBack: () => void;
  onSaved: () => void;
};

const AddExpenseScreen: React.FC<Props> = ({ onBack, onSaved }) => {
  const style = styles();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleSave = async () => {
    const parsedAmount = Number(amount);

    if (!title.trim() || !category.trim() || !parsedAmount || Number.isNaN(parsedAmount)) {
      return;
    }

    await ExpensesController.addExpense({
      title: title.trim(),
      amount: parsedAmount,
      category: category.trim(),
    });

    onSaved();
  };

  return (
    <Background style={style.background}>
      <KeyboardAvoidingView
        style={style.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={style.header}>
          <Text variant="heading">Add Expense</Text>
        </View>

        <View style={style.form}>
          <Input label="Title" value={title} onChangeText={setTitle} placeholder="Groceries" />
          <Input label="Amount" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="120.50" />
          <Input label="Category" value={category} onChangeText={setCategory} placeholder="Food" />
        </View>

        <View style={style.actions}>
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" variant="secondary" onPress={onBack} />
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
};

export default AddExpenseScreen;
