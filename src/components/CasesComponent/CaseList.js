import {useState, useEffect} from "react";
import { StyleSheet,  View, FlatList, RefreshControl, Alert } from "react-native";
import { Searchbar } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux';
import Background from "@components/UI/Background";
import Paragraph from '@components/UI/Paragraph'
import CaseItem from "@components/CasesComponent/CaseItem";
import Button from "@components/UI/Button"

import {requestCases, requestCasesOffline} from '@store/ducks/cases-slice'
import { Padder } from "../UI/Wrapper";

export default function CaseList({userId}) {
  
  let cases = useSelector((state) => state.cases.cases);
  const isLoading = useSelector((state) => state.cases.loading)
  const error = useSelector((state) => state.cases.error)
  const isConnected = useSelector(state => state.network.isConnected);
  
  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  const [refreshInterval, setRefreshInterval] = useState(1000*300);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(true);
  const [forceRerender, setForceRerender] = useState('')

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

  }, [dispatch, isFocused, forceRerender])


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
    return cases !== undefined ?cases.filter(searchCasesByName).reverse() : null;
  }

  let casesToShow = <View style = {{paddingTop: 20}}>
      <Paragraph>
        NO CASES TO DISPLAY
      </Paragraph>
      <Button mode="elevated" style={[styles.refreshButton]} 
                            onPress={() => setForceRerender((Math.random() + 1).toString(36).substring(7))}>
                              REFRESH </Button>
    </View>
  if(retriveAllCases() !== null && retriveAllCases().length != 0 && retriveAllCases()[0].customerName !== undefined) {
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
    flex: 1,
    width: 320
  },
  listsContainer : {   
    flex: 9,
    padding: 2,
    paddingTop: 25,
    alignItems: 'center',    
  },
  searchBox: {
    width: 320
  },
  refreshButton : {
    marginRight: 5,
    marginBottom: 10,
    alignSelf: "center"
  },

});
