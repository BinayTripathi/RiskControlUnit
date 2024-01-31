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
import { theme } from '../core/theme'
import { SECURE_USER_KEY, SECURE_USER_PIN, REGISTRATION_ERROR_MESSAGE} from '../core/constants'
import {secureSave, secureGet} from '@helpers/SecureStore'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
//import DeviceNumber from 'react-native-device-number';
//import {   getHash, requestHint,  startOtpListener,  useOtpVerify,} from 'react-native-otp-verify';
import SmsRetriever from 'react-native-sms-retriever';
import Stepper from '../components/UI/Stepper';

const CELL_COUNT = 4;
let step = -1
export default function RegistrationScreen({ route, navigation }) {


  //const userTracker = route.params && route.params.lastState ? <UserTracker displayCoordinates={false}/> : null
    let isLoading = useSelector((state) => state.user.loading);
    let userId = useSelector((state) => state.user.userId);
    let auth = useSelector((state) => state.user.auth)
    let error = useSelector((state) => state.user.error)
    let [isLoadingSms, setIsLoadSms] = useState(false)

    const dispatch = useDispatch()

    const [registeredPhoneNumber, setRegisteredPhoneNumber] = useState('')
    const [pin, setPin] = useState('')
    const [pinValidated, setIsPinValidated] = useState(false)
    const ref = useBlurOnFulfill({pin, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      pin,
      setPin,
    });

    const [errorRegistration, setErrorRegistration] = useState(false)
    useEffect(()=> {
      setIsPinValidated(false)
    },[])

    useEffect(()=> {
      if (isLoading !== true && error === REGISTRATION_ERROR_MESSAGE) {
        setErrorRegistration(true)
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: 'Registration Failed',
          textBody: 'Please contact admin',
          button: 'OK',          
          onHide: () => { 
            setRegisteredPhoneNumber('')
            setErrorRegistration(true)
          }
        })
      }  
    },[isLoading, error])
 
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
        
        setIsLoadSms(true)
        setTimeout(() => {
          setIsLoadSms(false)
          setIsPinValidated(true)
        }, 2000);

      } else {

        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: 'INCORRECT PIN',
          textBody: 'PLEASE TRY AGAIN...',
          button: 'Close',          
          onHide: () => { 
            setPin('')
          }
        })        
      }  

    }

   }

  if(!userId)
    step =0
  else if (!pinValidated)
    step =1
  else
    step = 2
    
    return (
      <LoadingModalWrapper shouldModalBeVisible = {isLoading || isLoadingSms}>
          <Background>
          <Padder>

            <Logo />
            <Header>REGISTRATION</Header>

             <Stepper stepComplete={step}/>
            
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
                disabled = {registeredPhoneNumber === ''}
                style={[Styles.button, registeredPhoneNumber === '' ? Styles.buttonDisabled : '']}
                onPress={registerUser }
                onLongPress={() => {
                  dispatch({ type: "DESTROY_SESSION" });
                 }}>
                Verify Mobile  
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
                disabled = {pin.toString().length < CELL_COUNT}
                style={[Styles.button, pin.toString().length < CELL_COUNT ? Styles.buttonDisabled : '']}
                onPress={vaildateOtp }
                onLongPress={() => {
                  dispatch({ type: "DESTROY_SESSION" });
                  }} >                
                Verify OTP
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
      marginTop: 70,
    },
    buttonDisabled : {
      backgroundColor: theme.colors.disabledPrimary
    },
    buttonDisabled : {
      backgroundColor: theme.colors.disabledPrimary,
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