import React from 'react';
import { View } from 'react-native';
import { Background, Button, Card, Text } from '../../../common/ui';
import { IGoalItem } from '../../../types/reducers';
import { useGoalProgress } from '../hooks/useGoalProgress';
import styles from './styles';

type Props = {
  goal: IGoalItem;
  onDelete: (id: string) => void;
};

const GoalProgressCard: React.FC<Props> = ({ goal, onDelete }) => {
  const style = styles();
  const progress = useGoalProgress(goal);

  return (
    <Background>
      <Card style={style.card}>
        <Text variant="title">{goal.name}</Text>
        <Text variant="body">Saved: ${goal.savedAmount.toFixed(2)}</Text>
        <Text variant="body">Target: ${goal.targetAmount.toFixed(2)}</Text>
        <View style={style.progressWrap}>
          <View style={[style.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text variant="label">Progress: {progress}%</Text>
        <Button title="Delete goal" variant="secondary" onPress={() => onDelete(goal.id)} />
      </Card>
    </Background>
  );
};

export default GoalProgressCard;
