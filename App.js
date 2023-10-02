import { StatusBar } from 'expo-status-bar';
import { StyleSheet} from 'react-native';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import store, {persistor} from '@store'
import { RootSiblingParent } from 'react-native-root-siblings';


import AppNavigator from './src/components/NavigationComponent/AppNavigator';

export default function App() {


  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
      <StatusBar style='dark'/>
        <RootSiblingParent>
          <AppNavigator/> 
        </RootSiblingParent>                
      </PersistGate>      
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 200,
    width: 350,
  },
});
