import React from 'react';
import Toast from "react-native-toast-message";
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import FlashMessage from "react-native-flash-message";
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {store} from './src/redux/store';
import Routes from './src/navigation/Routes';
import { SocketProvider } from './socket';

function App() {
  return (
    <Provider store={store}>
      <SocketProvider> 
      <GestureHandlerRootView style={{flex: 1}}>
        <Routes />
        {/* <Toast /> */}
        <FlashMessage position="top" />
      </GestureHandlerRootView>
      </SocketProvider>
    </Provider>
  );
}

export default App;
