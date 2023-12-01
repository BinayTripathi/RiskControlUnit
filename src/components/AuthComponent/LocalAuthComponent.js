import { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import * as LA from 'expo-local-authentication'

const LocalAuthComponent = ({navigation}) => {

    const [isBiometricSupported, setIsBiometricSupported] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const onAuthenticate = () => {

        try {
            
            const auth = LA.authenticateAsync({
                promptMessage: 'Authenticate with biometric',
                fallbackLabel: 'Enter Password',
                cancelLabel: 'Cancel-FULL'
            })
           
            auth.then(result => {
                //setIsAuthenticated(result.success)
                console.log(result)
                if(result.success === true)
                    navigation.reset({routes: [{name: 'CaseList'}]});   
            })

        }  catch(error){
            console.log(error)
        }


    }


    useEffect( () => {
        (async ()=> {
            //Check device compatibility for biometric
            const compatible = await LA.hasHardwareAsync()            
            //setIsBiometricSupported(compatible)
            
        })()        

        
    })


    return (<View>{onAuthenticate()}</View>)

}

export default LocalAuthComponent;