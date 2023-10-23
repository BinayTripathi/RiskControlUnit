import React, {  useRef, useState  } from "react";
import { StyleSheet,Text,TouchableOpacity, View, Image, Alert} from "react-native";
import { useDispatch} from 'react-redux'
import { useNavigation } from "@react-navigation/native";
import { PaperProvider } from 'react-native-paper';

import UserTracker from "./UserTracker";

import {theme} from '../../core/theme'

import {requestUpdateBeneficiaryPhotoCaseAction, requestUpdatePanCaseAction} from '@store/ducks/case-submission-slice'
import useLocationTracker from "@hooks/useLocationTracker";


//https://www.farhansayshi.com/post/how-to-save-files-to-a-device-folder-using-expo-and-react-native/
const ImagePreview = ({photoData, setPhotoData ,isSmiling, isBothEyeOpen, claimId, docType, email}) => {
  
    const navigation = useNavigation();
    let savedPhoto = useRef(null);
    const [displayMap, setDisplayMap] = useState(false);
    const dispatch = useDispatch()
    const tracker = useLocationTracker()
    
    const savePhoto = async () => {        

      console.log(`Beneficiary is ${isSmiling ? "": 'NOT'} smiling and has both eyes ${isBothEyeOpen ? 'OPEN' : 'CLOSED'}`)
      const documentDetailsForSubmission = {
        email,
        claimId,            
        Remarks:null,
        docType
      }
      
      if(docType === 'BENIFICIARY-PHOTO'){
        documentDetailsForSubmission.LocationLongLat = tracker
        documentDetailsForSubmission.locationImage = photoData
        documentDetailsForSubmission.locationData = `Beneficiary is ${isSmiling ? "": 'NOT'} smiling and has both eyes ${isBothEyeOpen ? 'OPEN' : 'CLOSED'}`
      } else {
        documentDetailsForSubmission.OcrLongLat = tracker
        documentDetailsForSubmission.OcrImage = photoData
      } 
      

      const savePayload = {
        claimId,
        documentDetails : documentDetailsForSubmission,
        id: Math.floor(1000 + Math.random() * 9000) * -1
      }
     
      Alert.alert(  
        'Save document',  
        `Do you want to save now ?`,  
        [  
            {  
                text: 'Ok',  
                onPress: () => {
                  setPhotoData();                 
                  if(docType === 'BENIFICIARY-PHOTO')
                    dispatch(requestUpdateBeneficiaryPhotoCaseAction(savePayload))
                  else
                   dispatch(requestUpdatePanCaseAction(savePayload))
                  navigation.goBack()
                 
                },  
                style: 'default',  
            }  ,
            {  
              text: 'Cancel',  
              onPress: () => {
               
                navigation.goBack()
               
              },  
              style: 'default',  
          }  
        ]  
    );  
      
    }   

    const displayMapHandler = () => {
      setDisplayMap((displayMap) => !displayMap)     
    }
    

    const displayMapModal = displayMap ?                             
                              <UserTracker photoData={photoData} displayMapHandler={displayMapHandler} shouldDisplayMap = {displayMap}/>
                             : ( <>
                                 <UserTracker photoData={false}/>
                                 <Image source={{uri: `data:image/jpg;base64,${photoData}`}} style={{ flex: 1, borderRadius: 10 }} />
                                   </> )
                            
 
  return (
    <PaperProvider>
      <View style={styles.container}>
        
        <View style={styles.middlePhoto} ref={savedPhoto}>
              {displayMapModal}
        </View>

        <View style={[styles.bottomPrev]}>
          <TouchableOpacity
            style={styles.prevBtn}
            onPress={() => setPhotoData(null)}>
            <Text style={styles.prevBtnText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.prevBtn, { marginLeft: 25 }]}
            onPress={savePhoto}>
            <Text style={styles.prevBtnText}>Save Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.prevBtn, { marginLeft: 25 }]}
            onPress={displayMapHandler}>
            <Text style={styles.prevBtnText}>Display Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  middlePhoto: {
    flex: 1,
    position: "relative",
  },
  bottomPrev: {
    height: 100,    
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 4
  },
  prevBtn: {
    height: 65,
    width: 100,
    backgroundColor: theme.colors.primary,
    color: theme.colors.inversePrimary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    marginTop: 20,
    elevation: 4,
  },
  prevBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});

export default ImagePreview;
