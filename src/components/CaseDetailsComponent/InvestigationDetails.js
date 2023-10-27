import { useState } from 'react'
import { StyleSheet,View, Text , Dimensions,  ScrollView} from 'react-native';
import  { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import PhotoIdScanner from './InvestigationDetails/PhotoIdScanner'
import DocumentScanner from './InvestigationDetails/DocumentScanner'
import FormInitiator from './InvestigationDetails/FormInitiator'


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
      {label: 'ID OCR', value: 'PAN'},
      {label: 'FACE READER', value: 'BENIFICIARY-PHOTO'}
    ]);

   const navigation = useNavigation();
   let loading = useSelector((state) => state.casesUpdates.loading);

    return (
   
   
        <View style={styles.container}>
          
          <View style = {{marginTop: 40}}>
            <Text style = {[styles.textBase, styles.description ]}>AGENT CAPABILITIES</Text>
          </View>
          
          <ScrollView> 
          <PhotoIdScanner selectedClaimId  userId/>
          <DocumentScanner/>
          <FormInitiator/>

          </ScrollView>
        </View>
        

 
    );

    
}

const styles = StyleSheet.create({
  container: {
    height: height,
    overflow: 'hidden',
    alignItems: "center",    
    paddingHorizontal: 5,
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
    marginVertical: 30,    
    paddingHorizontal: 5,
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
    width: width*0.95,
    zIndex: 200,
  },
  button: {
    marginRight: 5,
    marginBottom: 10
  }

})

