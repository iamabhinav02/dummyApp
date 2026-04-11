import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IModuleRootProps } from '../../types/modules';
import { Background } from '../../common/ui';
import ExpensesHomeScreen from './screens/ExpensesHomeScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import { ExpensesStackParamList, ROUTES } from '../../navigation/routes';
const Stack = createNativeStackNavigator<ExpensesStackParamList>();

export const ModuleRoot: React.FC<IModuleRootProps> = ({ onClose }) => {
  return (
    <Background style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName={ROUTES.MODULES.EXPENSES.HOME}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name={ROUTES.MODULES.EXPENSES.HOME}>
          {({ navigation }) => (
            <ExpensesHomeScreen
              onClose={onClose}
              onAddExpense={() => navigation.navigate(ROUTES.MODULES.EXPENSES.ADD)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name={ROUTES.MODULES.EXPENSES.ADD}>
          {({ navigation }) => (
            <AddExpenseScreen
              onBack={() => navigation.goBack()}
              onSaved={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </Background>
  );
};
