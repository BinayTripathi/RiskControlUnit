import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, PermissionsAndroid, Alert } from 'react-native';
import Background from '@components/UI/Background';
import { Padder } from '@components/UI/Wrapper';
import Logo from '@components/UI/Logo'
import Header from '@components/UI/Header'
import Button from '@components/UI/Button'
import LoadingModalWrapper from '@components/UI/LoadingModal';
import { useDispatch, useSelector } from 'react-redux'
import { AntDesign , FontAwesome5 } from '@expo/vector-icons';
import TextInput from '@components/UI/TextInput'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import * as Application from 'expo-application';
import { Platform } from 'expo-modules-core';
import RegistrationImageScanner from '@components/AuthComponent/RegistrationImageScanner'

import {requestRegisterUser} from '@store/ducks/userSlice'
import {SECURE_USER_KEY, SECURE_USER_PIN, REGISTRATION_ERROR_MESSAGE} from '../core/constants'
import {secureSave, secureGet} from '@helpers/SecureStore'
//import DeviceNumber from 'react-native-device-number';
//import {   getHash, requestHint,  startOtpListener,  useOtpVerify,} from 'react-native-otp-verify';
import SmsRetriever from 'react-native-sms-retriever';


const CELL_COUNT = 4;
export default function RegistrationScreen({ route, navigation }) {


  //const userTracker = route.params && route.params.lastState ? <UserTracker displayCoordinates={false}/> : null
    let isLoading = useSelector((state) => state.user.loading);
    let userId = useSelector((state) => state.user.userId);
    let auth = useSelector((state) => state.user.auth)
    let error = useSelector((state) => state.user.error)

    const dispatch = useDispatch()

    const [registeredPhoneNumber, setRegisteredPhoneNumber] = useState('')
    const [pin, setPin] = useState('')
    const [pinValidated, setIsPinValidated] = useState(false)
    const ref = useBlurOnFulfill({pin, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      pin,
      setPin,
    });

    useEffect(()=> {
      if (isLoading !== true && error === REGISTRATION_ERROR_MESSAGE) {
        Alert.alert('Problem registering phone number', 'Please contact support', [
            
          {text: 'OK', onPress: () => {setRegisteredPhoneNumber('')}},
        ]);      
        
      }  
    },[error])
 
  const getPhoneNumber = async => {
    (async () => {
      await getUserPhoneNumber()
    })()
  }


  const getUserPhoneNumber = async () => {
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
        {
          title: 'iCheckfy Phone State Permission',
          message:
            'Needed to get you phone details ',

          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log(`checking permissions ${granted}`)   
        
       
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        try {
          const phoneNumber = await SmsRetriever.requestPhoneNumber();
          console.log(`Phone no is ${phoneNumber}`)
          setRegisteredPhoneNumber(phoneNumber)
        } catch (error) {
          console.log(JSON.stringify(error));
        }
        
      }
    } catch (err) {
      console.warn(err);
    }
  }

  _onSmsListenerPressed = async () => {
    try {

      const grantedRcv = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        {
          title: 'iCheckfy SMS Permission',
          message:
            'Needed to get you phone details ',

          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      const grantedRead = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'iCheckfy SMS Permission',
          message:
            'Needed to get you phone details ',

          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('SMS listner')
      const registered = await SmsRetriever.startSmsRetriever();
      if (registered) {
        SmsRetriever.addSmsListener(event => {
          console.log(event.message);
          SmsRetriever.removeSmsListener();
        }); 
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const registerUser = async () => {
 
    if (Platform.OS === 'android') {
      console.log(Application.androidId)
      const dataToSendForReg = {
        phoneNo: registeredPhoneNumber.substring(1),
        deviceId: Application.androidId,
      }
      dispatch(requestRegisterUser(dataToSendForReg))
      _onSmsListenerPressed()
    }
   }

  

   const vaildateOtp = async ()  => { 
    
    if (Platform.OS === 'android') {
      secureSave(SECURE_USER_PIN,auth)
      secureSave(SECURE_USER_KEY,userId)

      if(auth === pin.toString()) {
        //navigation.navigate('Login')
        setIsPinValidated(true)

      } else {
        Alert.alert('Incorrect PIN', 'Please try again...', [
            
          {text: 'OK', onPress: () => setPin('')},
        ]);      
        
      }  

    }

   }

  
    
    return (
      <LoadingModalWrapper shouldModalBeVisible = {isLoading}>
          <Background>
          <Padder>
            <Logo />
            <Header>REGISTRATION</Header>
            
            {!userId && 
            <> 
              <TextInput
                label="Phone Number"
                returnKeyType="next"
                value={registeredPhoneNumber}
                //editable={false} 
                onFocus = {getUserPhoneNumber}
                onChangeText={(text) => setRegisteredPhoneNumber(text)}
                //error={!!email.error}
                //errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="tel"
                textContentType="telephoneNumber"
                keyboardType="phone-pad"
              />   
              
              <Button
                mode="elevated"
                //disabled = {pin.toString().length < CELL_COUNT  && emailValidator(email.value) === ''}
                style={[Styles.button,]}
                onPress={registerUser }
                onLongPress={() => {
                  dispatch({ type: "DESTROY_SESSION" });
                 }}>
                Please Enter Your Mobile Number  
                <AntDesign name="phone" size={24} color="white" />
              </Button> 
            </>}

        {userId && !pinValidated &&
        <>
          <CodeField
            ref={ref}        
            value={pin}
            onChangeText={setPin}
            cellCount={CELL_COUNT}
            rootStyle={Styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[Styles.cell, isFocused && Styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor/> : null)}
              </Text>
            )}/>

          <Button
                mode="elevated"
                //disabled = {pin.toString().length < CELL_COUNT  && emailValidator(email.value) === ''}
                style={[Styles.button,]}
                onPress={vaildateOtp }
                onLongPress={() => {
                  dispatch({ type: "DESTROY_SESSION" });
                  }} >                
                Please Enter OTP
              </Button>
        </>  }
                
              {userId && pinValidated && <RegistrationImageScanner/>}
        
          </Padder>
          
        </Background>
      </LoadingModalWrapper>
      
    )
  }

  const Styles = StyleSheet.create({
    button: {
      marginTop: 70
    },
    button_disabled: {
      opacity: 0.5
    },
    codeFieldRoot: {marginTop: 20},
    cell: {
      width: 40,
      height: 40,
      lineHeight: 38,
      marginRight: 2,
      fontSize: 24,
      borderWidth: 2,
      borderRadius: 8,
      borderColor: '#00000030',
      textAlign: 'center',
    },
    focusCell: {
      borderColor: '#000',
    },
    
  });