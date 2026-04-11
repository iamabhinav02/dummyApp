import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IModuleRootProps } from '../../types/modules';
import { Background } from '../../common/ui';
import CreditScoreHomeScreen from './screens/CreditScoreHomeScreen';
import CreditTipsScreen from './screens/CreditTipsScreen';
import { CreditScoreStackParamList, ROUTES } from '../../navigation/routes';

const Stack = createNativeStackNavigator<CreditScoreStackParamList>();

export const ModuleRoot: React.FC<IModuleRootProps> = ({ onClose }) => {
  return (
    <Background style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName={ROUTES.MODULES.CREDITSCORE.HOME}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name={ROUTES.MODULES.CREDITSCORE.HOME}>
          {({ navigation }) => (
            <CreditScoreHomeScreen
              onClose={onClose}
              onViewTips={() => navigation.navigate(ROUTES.MODULES.CREDITSCORE.TIPS)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name={ROUTES.MODULES.CREDITSCORE.TIPS}>
          {({ navigation }) => (
            <CreditTipsScreen onBack={() => navigation.goBack()} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </Background>
  );
};
