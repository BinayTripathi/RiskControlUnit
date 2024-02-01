import Background from "@components/UI/Background";
import CaseDetails from "@components/CaseDetailsComponent/CaseDetails";
import { useEffect } from "react";
import { Alert } from "react-native";

import { useDispatch, useSelector } from 'react-redux';


import { requestCaseDetails } from '@store/ducks/case-details-slice'


export default function CaseDetailsScreen({navigation, route}) {

  const dispatch = useDispatch()
  const claimId = route.params.claimId;
  const userId = useSelector(state => state.user.userId)

  useEffect(() => {     
      console.log('Fetching details')  
      
      const payload = {
          "userId" : userId,
           "claimId": claimId
      }
      
      dispatch(requestCaseDetails(payload))  
      /*const focusHandler = navigation.addListener('focus', () => {
          Alert.alert('Refreshed');
      });
      return focusHandler;*/
      
  }, [dispatch])


return (
    <Background style={{ flex: 1 }}>
        <CaseDetails claimId = {claimId} userId={userId}/>       
   </Background>  
  );
}

