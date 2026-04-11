import React from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Background, Button, Text } from '../../../common/ui';
import { MODULES } from '../../../constants/modules';
import { GoalsController } from '../../../controllers/GoalsController';
import { ICombinedAppState } from '../../../store';
import GoalProgressCard from '../components/GoalProgressCard';
import styles from './styles';

type Props = {
  onClose: () => void;
  onAddGoal: () => void;
};

const GoalsHomeScreen: React.FC<Props> = ({ onClose, onAddGoal }) => {
  const style = styles();
  const goals = useSelector((state: ICombinedAppState) => state[MODULES.GOALS.reducerKey].items);

  return (
    <Background style={style.background}>
      <View style={style.container}>
        <View style={style.header}>
          <Text variant="heading">Goals Planner</Text>
          <Button title="Back to Hub" variant="secondary" onPress={onClose} />
        </View>

        <Button title="Add goal" onPress={onAddGoal} />

        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={style.listContent}
          ListEmptyComponent={<Text variant="body">No goals yet. Add your first one.</Text>}
          renderItem={({ item }) => (
            <GoalProgressCard
              goal={item}
              onDelete={(id) => GoalsController.removeGoal(id)}
            />
          )}
        />
      </View>
    </Background>
  );
};

export default GoalsHomeScreen;
