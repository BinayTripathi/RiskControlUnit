
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet} from 'react-native';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import store, {persistor} from '@store'
import { RootSiblingParent } from 'react-native-root-siblings';


import AppNavigator from './src/components/NavigationComponent/AppNavigator';
import {en, registerTranslation } from 'react-native-paper-dates'
import {secureGet} from '@helpers/SecureStore'
import {SECURE_USER_KEY} from '@core/constants'
import { AlertNotificationRoot} from 'react-native-alert-notification';

export default function App() {


  const [isRegistered, setIsRegistered] = useState(false)

  useEffect( () => {
       
        (async ()=> {         
          try{
            const email = await secureGet(SECURE_USER_KEY)                     
            if(email !== '' && email !== undefined && email !== null){
              console.log(email)
              setIsRegistered(true)
            }
           
          } catch(error){
        console.log(error)
        }
            
        })()        
    },[])

  registerTranslation('en', {
    save: 'Save',
    selectSingle: 'Select date',
    selectMultiple: 'Select dates',
    selectRange: 'Select period',
    notAccordingToDateFormat: (inputFormat) =>
      `Date format must be ${inputFormat}`,
    mustBeHigherThan: (date) => `Must be later then ${date}`,
    mustBeLowerThan: (date) => `Must be earlier then ${date}`,
    mustBeBetween: (startDate, endDate) =>
      `Must be between ${startDate} - ${endDate}`,
    dateIsDisabled: 'Day is not allowed',
    previous: 'Previous',
    next: 'Next',
    typeInDate: 'Type in date',
    pickDateFromCalendar: 'Pick date from calendar',
    close: 'Close',
  })

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
      <StatusBar style='dark'/>
        <RootSiblingParent>
          <AlertNotificationRoot>
            <AppNavigator isRegistered = {isRegistered}/> 
          </AlertNotificationRoot>
          
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
