import React, {useState} from 'react'
import { StyleSheet, View } from 'react-native';
import Background from '@components/UI/Background';
import { Padder } from '@components/UI/Wrapper';
import Logo from '@components/UI/Logo'
import Header from '@components/UI/Header'
import Button from '@components/UI/Button'
import { useDispatch } from 'react-redux'
import { FontAwesome5 } from '@expo/vector-icons';
import TextInput from '@components/UI/TextInput'

import * as Application from 'expo-application';
import { Platform } from 'expo-modules-core';

export default function RegistrationScreen({ route, navigation }) {

  const dispatch = useDispatch()
    //const userTracker = route.params && route.params.lastState ? <UserTracker displayCoordinates={false}/> : null
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })

   const fetchImei = async () => {
    if (Platform.OS === 'android') {
      console.log(Application.androidId)
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
          <Button
            mode="elevated"
            style={Styles.button}
            onPress={fetchImei }
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
    }
  });