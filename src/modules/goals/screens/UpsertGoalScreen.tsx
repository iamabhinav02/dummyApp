import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Background, Button, Input, Text } from '../../../common/ui';
import { GoalsController } from '../../../controllers/GoalsController';
import styles from './styles';

type Props = {
  onBack: () => void;
  onSaved: () => void;
};

const UpsertGoalScreen: React.FC<Props> = ({ onBack, onSaved }) => {
  const style = styles();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');

  const handleSave = async () => {
    const parsedTargetAmount = Number(targetAmount);
    const parsedSavedAmount = Number(savedAmount);

    if (
      !name.trim() ||
      Number.isNaN(parsedTargetAmount) ||
      Number.isNaN(parsedSavedAmount) ||
      parsedTargetAmount <= 0 ||
      parsedSavedAmount < 0
    ) {
      return;
    }

    await GoalsController.upsertGoal({
      name: name.trim(),
      targetAmount: parsedTargetAmount,
      savedAmount: parsedSavedAmount,
    });

    onSaved();
  };

  return (
    <Background style={style.background}>
      <KeyboardAvoidingView
        style={style.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <Text variant="heading">Create Goal</Text>

        <View style={style.form}>
          <Input label="Goal name" value={name} onChangeText={setName} placeholder="Emergency fund" />
          <Input
            label="Target amount"
            value={targetAmount}
            onChangeText={setTargetAmount}
            keyboardType="decimal-pad"
            placeholder="5000"
          />
          <Input
            label="Saved amount"
            value={savedAmount}
            onChangeText={setSavedAmount}
            keyboardType="decimal-pad"
            placeholder="1200"
          />
        </View>

        <View style={style.actions}>
          <Button title="Save goal" onPress={handleSave} />
          <Button title="Cancel" variant="secondary" onPress={onBack} />
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
};

export default UpsertGoalScreen;
