import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import commonStore from './src/store';
import { AppContextProvider } from './src/context/appContext';
import Landing from './src/components/Landing';
// import Movies from './src/components/Movies';

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={commonStore}>
        <AppContextProvider>
          <PaperProvider>
            <Landing />
            {/* <Movies /> */}
          </PaperProvider>
        </AppContextProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
