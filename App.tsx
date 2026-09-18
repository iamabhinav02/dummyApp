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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ConversationController } from './src/controllers/ConversationController';

enableScreens();

const App = () => {
  useEffect(() => {
    ConversationController.hydrate();
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
