import React, {useState} from 'react'
import { StyleSheet, View, Text } from 'react-native';
import Background from '@components/UI/Background';
import { Padder } from '@components/UI/Wrapper';
import Logo from '@components/UI/Logo'
import Header from '@components/UI/Header'
import Button from '@components/UI/Button'
import { useDispatch } from 'react-redux'
import { FontAwesome5 } from '@expo/vector-icons';
import TextInput from '@components/UI/TextInput'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import * as Application from 'expo-application';
import { Platform } from 'expo-modules-core';
import * as SecureStore from 'expo-secure-store';
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'

import {requestRegisterUser} from '@store/ducks/userSlice'
import {SECURE_USER_KEY, SECURE_USER_PIN} from '../core/constants'

const CELL_COUNT = 6;
export default function RegistrationScreen({ route, navigation }) {

  //const userTracker = route.params && route.params.lastState ? <UserTracker displayCoordinates={false}/> : null
    const dispatch = useDispatch()
    const [email, setEmail] = useState({ value: '', error: '' })
    const [pin, setPin] = useState('')
    const ref = useBlurOnFulfill({pin, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      pin,
      setPin,
    });


    async function secureSave(key, value) {
      await SecureStore.setItemAsync(key, value);
    }

   const registerUser = async () => {

    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })      
      return
    }
    if (Platform.OS === 'android') {
      console.log(Application.androidId)
      secureSave(SECURE_USER_PIN,pin.toString())
      secureSave(SECURE_USER_KEY,email.value)

      const dataToSendForReg = {
        emailId: email.value,
        password: pin,
        deviceId: Application.androidId,
      }

      dispatch(requestRegisterUser(dataToSendForReg))
    }
   }
    
    return (
      <Background>
        <Padder>
          <Logo />
          <Header>REGISTRATION</Header>
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: '' })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />

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
        )}
      />
          
          <Button
            mode="elevated"
            disabled = {pin.toString().length < CELL_COUNT  && emailValidator(email.value) === ''}
            style={[Styles.button, pin.toString().length < CELL_COUNT? Styles.button_disabled: {}]}
            onPress={registerUser }
             onLongPress={() => {
              dispatch({ type: "DESTROY_SESSION" });
              navigation.navigate('Login')}}
          >
            <FontAwesome5 name="praying-hands" size={20} color="white" />
            WELCOME AGENT
          </Button>
        </Padder>
        
      </Background>
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