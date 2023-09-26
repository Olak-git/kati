/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import Route from './routes/Route';
import { Provider } from 'react-redux';
import { LogBox } from 'react-native';
import { PersistGate } from 'redux-persist/es/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import store from './app/store';

LogBox.ignoreAllLogs();

let persistor = persistStore(store)

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Route />
      </PersistGate>
    </Provider>
  )
};

export default App;
