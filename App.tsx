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
import { IConversionHistoryItem } from './src/types/reducers';
import CommonReduxStore from './src/store/commonStore';
import { CONVERSION } from './src/reducers/actions';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

enableScreens();

const App = () => {
  const hydrateReducers = async () => {
    await AsyncStorageController.hydrate([
      STORAGE_KEYS.CONVERSION_HISTORY,
    ]);

    const history = await AsyncStorageController.get<IConversionHistoryItem[]>(
      STORAGE_KEYS.CONVERSION_HISTORY
    );

    if (history && history.length > 0) {
      CommonReduxStore.getInstance().dispatch({
        type: CONVERSION.ADD_TO_HISTORY,
        payload: { conversionHistory: history },
      });
    }
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
