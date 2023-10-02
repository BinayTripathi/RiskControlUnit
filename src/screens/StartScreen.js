import React from 'react'
import { StyleSheet, View } from 'react-native';
import Background from '@components/UI/Background';
import { Padder } from '@components/UI/Wrapper';
import Logo from '@components/UI/Logo'
import Header from '@components/UI/Header'
import Button from '@components/UI/Button'
import Paragraph from '@components/UI/Paragraph'
import { useDispatch } from 'react-redux'
import { FontAwesome5 } from '@expo/vector-icons';

export default function StartScreen({ route, navigation }) {

  const dispatch = useDispatch()
    //const userTracker = route.params && route.params.lastState ? <UserTracker displayCoordinates={false}/> : null
    
    return (
      <Background>
        <Padder>
          <Logo />
          <Header>Risk Control Unit</Header>
          <Paragraph>
            The easiest way to track and report the investigation.
          </Paragraph>
          <Button
            mode="elevated"
            style={Styles.button}
            onPress={() => {              
              navigation.navigate('Login')}   
             }
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