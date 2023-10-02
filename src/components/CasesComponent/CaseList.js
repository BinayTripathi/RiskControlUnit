import {useState, useEffect} from "react";
import { StyleSheet,  View, FlatList, RefreshControl, Alert } from "react-native";
import { Searchbar } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native'

import { useDispatch, useSelector } from 'react-redux';
import Background from "@components/UI/Background";
import Paragraph from '@components/UI/Paragraph'
import CaseItem from "@components/CasesComponent/CaseItem";



import {requestCases, requestCasesOffline} from '@store/ducks/cases-slice'
import { Padder } from "../UI/Wrapper";




export default function CaseList() {

  let cases = useSelector((state) => state.cases.cases);
  const isLoading = useSelector((state) => state.cases.loading)
  const error = useSelector((state) => state.cases.error)
  const isConnected = useSelector(state => state.network.isConnected);

  const userId = useSelector(state => state.user.userId)
  
  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  const [refreshInterval, setRefreshInterval] = useState(1000*300);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(true);

  const onChangeSearch = query => setSearchQuery(query);
 
  const dispatchFetchRequest = () => {
    setRefreshing(true)
    console.log('Fetching list')
    dispatch(requestCases(userId))  
    setRefreshing(false)
  }

  useEffect(() => {
    if (isFocused) {
       if(isConnected)
          dispatchFetchRequest();
        else  {
          const offlineCases = {
            cases
          }
          dispatch(requestCasesOffline(offlineCases)) 
        }
    }  

  }, [dispatch, isFocused])


  /*useEffect(() => {
    if (refreshInterval && refreshInterval > 0 && isConnected) {
      const interval = setInterval(dispatchFetchRequest, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);*/


 /* if (isLoading) {
    return <Text>loading...</Text>
  }

  if (error) {
    return <Text>error...</Text>
  }*/


  function renderClaimItem(itemData) {
    return(     
          <CaseItem caseDetails = {itemData.item} />    
    )
  }

  const searchCasesByName = (caseToCheck) => {
    if(searchQuery.length != 0)
      return caseToCheck.customerName.startsWith(searchQuery) || 
              caseToCheck.policyNumber.startsWith(searchQuery)
    
    return true
  }

  const retriveAllCases = () => {
    return cases.filter(searchCasesByName).reverse();
  }

  let casesToShow = <View style = {{paddingTop: 20}}>
      <Paragraph>
        NO CASES TO DISPLAY
      </Paragraph>
    </View>
  if(retriveAllCases().length != 0) {
    casesToShow =    <FlatList data={retriveAllCases()} 
                      renderItem={renderClaimItem} 
                      keyExtractor={(item) => item.claimId}
                      refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={dispatchFetchRequest} />
                      }/>
           
  }

  return (
    <LoadingModalWrapper shouldModalBeVisible = {isLoading}>
      <Background>      
        <Padder>
        <View style= {styles.container}>

            <View style= {styles.searchBoxContainer}>
                <Searchbar
                      placeholder="Search By Name/Policy"
                      onChangeText={onChangeSearch}
                      value={searchQuery}/>
            </View>
            <View style= {styles.listsContainer}>
                {isLoading ? null : casesToShow}
            </View>      
  </View>       

        </Padder>
              
        
      </Background>
    </LoadingModalWrapper>
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop: 90,      
    justifyContent: 'center',
    paddingBottom: 10
  },
  searchBoxContainer : {
    flex: 1
  },
  listsContainer : {   
    flex: 9,
    padding: 2,
    paddingTop: 25,
    alignItems: 'center',    
  },
  searchBox: {
    width: 250
  }
});
