import { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import * as LA from 'expo-local-authentication'
import { useDispatch} from 'react-redux'
import {requestValidateUser, requestValidateUserAuto, navigateFromHomePage} from '@store/ducks/userSlice'
import * as SecureStore from 'expo-secure-store';
import {SECURE_USER_KEY} from '@core/constants'

const LocalAuthComponent = ({setBiometicCancelled}) => {

    const [isBiometricSupported, setIsBiometricSupported] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState('')
    const [authCalled, setAuthCalled] = useState(false)

    let dispatch = useDispatch();


    const onAuthenticate = () => {
        setAuthCalled(true)
        try {            
            const auth = LA.authenticateAsync({
                promptMessage: 'Authenticate with biometric',
                fallbackLabel: 'Enter Password',
                cancelLabel: 'Cancel-FULL'
            })
           
            auth.then(result => {
                if(result.success === true)
                    {
                        const dataToSendForAuth = {
                            emailId: user,
                            password: '__BIOMETRIC__'
                          }                                                   
                          dispatch(requestValidateUser(dataToSendForAuth))
                    }
                else 
                    setBiometicCancelled(true)
            })

        }  catch(error){
            console.log(error)
            setBiometicCancelled(true)
        }
    }


    useEffect( () => {

        async function getSecure(key) {
            return await SecureStore.getItemAsync(key);
          }

        (async ()=> {
            //Check device compatibility for biometric
            const compatible = await LA.hasHardwareAsync()            
            const email = await getSecure(SECURE_USER_KEY)                     
            setUser(email)
        })()        
    },[])


    return (<View>{!authCalled && user !== '' && onAuthenticate()}</View>)

}

export default LocalAuthComponent;