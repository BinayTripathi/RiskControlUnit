import { useState } from 'react'
import { StyleSheet,View, Text , Dimensions} from 'react-native';
import  { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';


import DropDownPicker from 'react-native-dropdown-picker';

import Button from '@components/UI/Button'
import { SCREENS } from '@core/constants';
import InvestigationDocumentList from './InvestigationDetails/InvestigationDocumentsList';
import LoadingModalWrapper from "@components/UI/LoadingModal"

const { width, height } = Dimensions.get('window');

export default InvestigationDetails = function ({selectedClaimId, userId}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'PAN', value: 'PAN'},
      {label: 'BENIFICIARY PHOTO', value: 'BENIFICIARY-PHOTO'},
    ]);

   const navigation = useNavigation();
   let loading = useSelector((state) => state.casesUpdates.loading);

    //let isLoading = useSelector(state => state.casesUpdates.loading)
   // let error = useSelector(state => state.casesUpdates.error)
    //let caseUpdates = useSelector(state => state.casesUpdates.casesUpdates); //To get updated list of documents saved for submission
    return (
      <LoadingModalWrapper shouldModalBeVisible = {loading}>
        <View style={styles.container}>
          
          <View style = {{marginTop: 100}}>
            <Text style = {[styles.textBase, styles.description ]}>DOCUMENT SUBMISSION</Text>
          </View>
          

          <View style= {styles.inputContainer}>

              <View style={{padding: 10}}>
                  <Button mode="elevated" style={[styles.button,!value? {backgroundColor: 'grey'} : {}]} 
                              disabled={value === null} onPress={() => navigation.navigate(SCREENS.ImageCaptureScreen, {
                                docType: value,
                                claimId: selectedClaimId,
                                email: userId
                              })}> { value === 'BENIFICIARY-PHOTO' ? 'CLICK' : 'SCAN'}  </Button>
              </View>
        
              <View style={{marginLeft: 5}}>
                
              </View>

              <DropDownPicker open={open} value={value} items={items} setOpen={setOpen} setValue={setValue} setItems={setItems}
                  
                    containerStyle={{
                    }}
                    style={{
                      backgroundColor: 'white',
                      zIndex: 1000
                    }}
                    textStyle={{
                      fontSize:15
                    }} />

            
              
          </View>
          <InvestigationDocumentList selectedClaimId = {selectedClaimId}/>
        </View>
     </LoadingModalWrapper>
    );

    
}

const styles = StyleSheet.create({
  container: {
    height: height,
    overflow: 'hidden',
    alignItems: "center",
    
    paddingHorizontal: 20,
    padding: 50,
  },
  textBase: {
    color: 'black',
  },
  description: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer : {
    flexDirection: 'row',
    margin: 30,    
    paddingHorizontal: 50,
    alignItems: 'baseline',
  },
  button: {
    marginRight: 5,
    marginBottom: 10
  }

})

