import React, { useState, useEffect } from "react";
import { PanResponder , AppState} from 'react-native';
import moment from 'moment';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { useSelector, useDispatch } from 'react-redux'
import {logoutUser} from '@store/ducks/userSlice'
import { SCREENS } from '@core/constants';

const useInactivityMonitor = () => {
   
    const dispatch = useDispatch()
    const lastInteraction = React.useRef(new Date()); // Ref to store the timestamp of the last interaction
    const inactivityTimer = React.useRef(null);  // Ref to store the ID of the inactivity timer
    const IDLE_LOGOUT_TIME_LIMIT = 1 * 30 * 1000;  // Set the time limit for inactivity logout (30 sec)

    const [isInactive, setIsInactive] = useState(false)
    const [resetTimer, setResetTimer] = useState(null)
    const [isFocused, setIsFocused] = useState(false)


    let isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    const resetInactivityTimeout = () => {
        inactivityTimer.current = null
        lastInteraction.current = new Date()
        setIsInactive(false)
        //setResetTimer(moment())
    }

    const panResponder = React.useRef(
            PanResponder.create({
                onStartShouldSetPanResponderCapture: () => {
                console.log('captured')
                resetInactivityTimeout()
                return false
                },
            onMoveShouldSetPanResponder: () => false,
            onPanResponderTerminationRequest: () => false,
            onShouldBlockNativeResponder: () => false,
            })
        ).current;

    const checkInactive = React.useCallback(() => {
        // Check if the inactivity timer is already running
        if (inactivityTimer.current || !isLoggedIn ) {
            return;
        }

        // Start the inactivity timer
        inactivityTimer.current = setInterval(() => {            
            const currentTime = moment();  // Get the current time
            const elapsedTime = moment(currentTime).diff(lastInteraction.current); // Calculate the elapsed time since the last interaction
            console.log('checking activity ' + elapsedTime )
            if (elapsedTime >= IDLE_LOGOUT_TIME_LIMIT) {  // Check if the elapsed time exceeds the defined time limit
                setIsInactive(true);
            }
        }, 1000); // Check every second
        }, [setIsInactive]);

        React.useEffect(() => {  
            if(isLoggedIn && isFocused)      
             checkInactive();// Initialize inactivity tracking when the component mounts
            return () =>{
                clearInterval(inactivityTimer.current);  // Cleanup function to clear the inactivity timer on component unmount
                resetInactivityTimeout()
            } 
        }, [resetTimer, isFocused]);

        React.useEffect(() => {  
            if(!isLoggedIn || !isFocused)      
                clearInterval(inactivityTimer.current);  // Cleanup function to clear the inactivity timer on component unmount
        }, [isLoggedIn, isFocused]);
        
        React.useEffect(() => {
            // Function to handle changes in app state (background/foreground)
            const handleAppStateChange = (nextAppState) => {
            // If the app is back in the foreground, reset the timeout
            if (nextAppState === 'active') {
                resetInactivityTimeout();
            }
            };
           // Subscribe to app state changes
            AppState.addEventListener('change', handleAppStateChange);
           // Cleanup function to remove the subscription when the component unmounts
            /*return () => {
            AppState.removeEventListener('change', handleAppStateChange);
            };*/
           }, [resetInactivityTimeout]);


           useEffect(() => { 
            if(isInactive === true) {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Logging out',
                    textBody: 'Logging out due to inactivity',
                    button: 'OK',          
                    onHide: () => { 
                        resetInactivityTimeout()
                        dispatch(logoutUser())
                    }
                  })
                }
    
        },[isInactive])


    return { panResponder, setIsFocused , checkInactivity, clearInactivity};
  };

  export default useInactivityMonitor