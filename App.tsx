import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import commonStore from './src/store';
import Landing from './src/components/Landing';

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={commonStore}>
        <PaperProvider>
          <Landing />
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
