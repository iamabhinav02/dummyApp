import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { PortalProvider } from '@gorhom/portal';
import { enableScreens } from 'react-native-screens';
import commonStore from './src/store';
import { AppContextProvider } from './src/context/appContext';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import { AsyncStorageController } from './src/controllers/AsyncStorageController';
import { STORAGE_KEYS } from './src/constants/storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ExpensesController } from './src/controllers/ExpensesController';
import { CreditScoreController } from './src/controllers/CreditScoreController';
import { GoalsController } from './src/controllers/GoalsController';

enableScreens();

const App = () => {
  const hydrateReducers = async () => {
    await AsyncStorageController.hydrate([
      STORAGE_KEYS.EXPENSES_ITEMS,
      STORAGE_KEYS.CREDITSCORE_DATA,
      STORAGE_KEYS.GOALS_ITEMS,
    ]);

    await Promise.all([
      ExpensesController.hydrate(),
      CreditScoreController.hydrate(),
      GoalsController.hydrate(),
    ]);
  };

  useEffect(() => {
    hydrateReducers();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={commonStore}>
          <AppContextProvider>
            <PaperProvider>
              <PortalProvider>
                <NavigationContainer>
                  <Navigation />
                </NavigationContainer>
              </PortalProvider>
            </PaperProvider>
          </AppContextProvider>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
