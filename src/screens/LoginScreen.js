import React, { useState, useEffect } from 'react'
import {StyleSheet, Text, View} from "react-native"
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

import {requestValidateUser, requestValidateUserAuto, navigateFromHomePage} from './../store/ducks/userSlice'
import Background from '@components/UI/Background'
import Logo from '@components/UI/Logo'
import Header from '@components/UI/Header'
import Button from '@components/UI/Button'
import Paragraph from '@components/UI/Paragraph'
import TextInput from '@components/UI/TextInput'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { Entypo } from '@expo/vector-icons';

import { theme } from '../core/theme'
import { SCREENS, SESSION_TTL_IN_SEC } from '../core/constants'
import LoadingModalWrapper from '@components/UI/LoadingModal';
import {reset} from '@services/NavigationService';
import Constanst from 'expo-constants'

export default function LoginScreen({navigation}) {

  const BASE_URL = Constanst?.expoConfig?.extra?.baseURL
  let isLoading = useSelector((state) => state.user.loading);
  let userLoggingError = useSelector((state) => state.user.error);
  let userLoggingTimestamp = useSelector((state) => state.user.lastLogin);
  let userId = useSelector((state) => state.user.userId)
  let dispatch = useDispatch();
  const isFocused = useIsFocused()

  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })


  //If coming from home page state should be no error and not loading
  /*useEffect(() => {
    
    const routes = navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2];
    if(prevRoute.name === SCREENS.Home ) {
      dispatch(navigateFromHomePage())
    }
  }, [navigation])

  useEffect(() => {
    if (isFocused) {
      dispatch(navigateFromHomePage())
    }  

  }, [dispatch, isFocused])*/


  // if loging within 30 sec of loggout, dispatch autologin
  useEffect(() => { 
    dispatch(navigateFromHomePage())
    console.log(Math.floor(new Date() - new Date(userLoggingTimestamp)))
    if(Math.floor(new Date() - new Date(userLoggingTimestamp)) < SESSION_TTL_IN_SEC.USER_SESSION) {
      const dataforLogin = {
        emailId: userId
      }
      dispatch(requestValidateUserAuto(dataforLogin))
      navigation.reset({routes: [{name: 'CaseList'}]});   
    }
    
  }, [dispatch, isFocused, navigation])

  const onLoginPressed = async (e) => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    const headerOptions = new Headers()
    headerOptions.append(
      'Content-Type',
      'application/x-www-form-urlencoded;charset=UTF-8'
    )
    headerOptions.append(
      'Access-Control-Allow-Origin',
      'http://localhost:19006'
    )
    headerOptions.append('Access-Control-Allow-Credentials', 'true')
    headerOptions.append('GET', 'POST', 'OPTIONS')
    const dataToSendForAuth = {
      emailId: email.value,
      password: password.value,
      returnUrl: 'http://localhost:19006/',
    }
    /*let formBody = []
    for (const key in dataToSend) {
      if (Object.hasOwn(dataToSend, key)) {
        const encodedKey = encodeURIComponent(key)
        const encodedValue = encodeURIComponent(dataToSend[key])
        formBody.push(encodedKey + '=' + encodedValue)
      }
    }

    formBody = formBody.join('&')
    e.preventDefault()
    const requestOptions = {
      method: 'POST',
      headers: headerOptions,
      body: formBody,
    }*/

    //Moved to Saga
    /*navigation.reset({
      index: 0,
      routes: [{ name: 'CaseList' }],
    })*/

    dispatch(requestValidateUser(dataToSendForAuth))
  }

   const loggingError = userLoggingError ? 
   <Text style={styles.errorTextStyle}>Invalid user id or password</Text> 
   :null
  return (
    <LoadingModalWrapper shouldModalBeVisible = {isLoading}>
      <Background>
        
        <View style = {styles.wrapper}>

          <Logo />         
          <Text style={{fontWeight: '800'}}>DEMO VERSION</Text>         
          <Text>URL: {BASE_URL}</Text>
         
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
          <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          <View>{loggingError}</View>
          <Button mode="contained" onPress={onLoginPressed} 
            onLongPress={() => {
              dispatch({ type: "DESTROY_SESSION" });
              onLoginPressed() }}
              style={styles.button}>
          <Entypo name="key" size={18} color="white" /> LOGIN
          </Button>

        </View>    
      
      </Background>
    </LoadingModalWrapper>
  )
};

const styles = StyleSheet.create({

  wrapper : {
    flex:1,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  button: {
    marginTop: 50
  },

  errorTextStyle: {
    color: theme.colors.error,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold'
  },

})
