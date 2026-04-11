import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IModuleRootProps } from '../../types/modules';
import { Background } from '../../common/ui';
import GoalsHomeScreen from './screens/GoalsHomeScreen';
import UpsertGoalScreen from './screens/UpsertGoalScreen';
import { GoalsStackParamList, ROUTES } from '../../navigation/routes';

const Stack = createNativeStackNavigator<GoalsStackParamList>();

export const ModuleRoot: React.FC<IModuleRootProps> = ({ onClose }) => {
  return (
    <Background style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName={ROUTES.MODULES.GOALS.HOME}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name={ROUTES.MODULES.GOALS.HOME}>
          {({ navigation }) => (
            <GoalsHomeScreen
              onClose={onClose}
              onAddGoal={() => navigation.navigate(ROUTES.MODULES.GOALS.UPSERT)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name={ROUTES.MODULES.GOALS.UPSERT}>
          {({ navigation }) => (
            <UpsertGoalScreen
              onBack={() => navigation.goBack()}
              onSaved={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </Background>
  );
};
