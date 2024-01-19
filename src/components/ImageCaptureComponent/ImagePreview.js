import React, {  useRef, useState  } from "react";
import { StyleSheet,Text,TouchableOpacity, View, Image, Alert, Dimensions} from "react-native";
import { useDispatch} from 'react-redux'
import { useNavigation } from "@react-navigation/native";
import { PaperProvider } from 'react-native-paper';

import {userRegisterPhoto} from '@services/RestServiceCalls'
import useApi from '@hooks/useApi'
import UserTracker from "./UserTracker";

import {theme} from '../../core/theme'
import { UPLOAD_TYPE } from '@core/constants';

import {requestUpdateBeneficiaryPhotoCaseAction, requestUpdatePanCaseAction} from '@store/ducks/case-submission-slice'
import useLocationTracker from "@hooks/useLocationTracker";
import LoadingModalWrapper from '@components/UI/LoadingModal';


let imageRatio = 1
//https://www.farhansayshi.com/post/how-to-save-files-to-a-device-folder-using-expo-and-react-native/
const ImagePreview = ({photoData, setPhotoData ,isSmiling, isBothEyeOpen, claimId, docType, email}) => {
  
    const navigation = useNavigation();
    let savedPhoto = useRef(null);
    const [displayMap, setDisplayMap] = useState(false);
    const dispatch = useDispatch()
    const tracker = useLocationTracker()
    const { triggerApi, data, error, loading } = useApi(userRegisterPhoto, photoData);
    //const {widthPic, heightPic} = Image.resolveAssetSource(photoData);
    //console.log(`${widthPic} , ${heightPic}`)

    if (data !== null)      {
      Alert.alert('Registration Successful', 'Continue to login...', [
        
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);      
      
    }              

    if (error !== null)      {
      Alert.alert('Failed to save photo', 'Please try again...', [
        
        {text: 'OK', onPress: () => console.log('failed agent photo')},
      ]);      
      
    }   
     
    Image.getSize(`data:image/png;base64,${photoData}`, (width, height) => {imageRatio = width/ width});

      console.log(imageRatio)
      
    
    const savePhoto = async () => {        

      console.log(`Beneficiary is ${isSmiling ? "": 'NOT'} smiling and has both eyes ${isBothEyeOpen ? 'OPEN' : 'CLOSED'}`)
      const documentDetailsForSubmission = {
        email : email,
        claimId: claimId,            
        Remarks:null,
        docType: docType.type,
        capability: docType.name
      }
      
      if(docType.type === UPLOAD_TYPE.PHOTO){
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
        `Do you want to save ${docType.name} image ?`,  
        [  
            {  
                text: 'Ok',  
                onPress: async () => {      
                  if (claimId !== "AGENT_ONBOARDING")   {
                    if(docType.type === 'PHOTO')
                      dispatch(requestUpdateBeneficiaryPhotoCaseAction(savePayload))
                    else
                      dispatch(requestUpdatePanCaseAction(savePayload))

                   navigation.goBack()    
                  }  else {
                   await triggerApi()     
                    
                  }      
                               
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
                                 <Image source={{uri: `data:image/jpg;base64,${photoData}`}} style={styles.middlePhoto}  />
                                   </> )
                            
 
  return (
    <PaperProvider>
      <LoadingModalWrapper shouldModalBeVisible = {loading === undefined ? false: loading}>
      <View style={styles.container}>
        
        <View style={styles.middlePhotoContainer} ref={savedPhoto}>
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
        </View>
      </View>
      </LoadingModalWrapper>
    </PaperProvider>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  middlePhotoContainer: {   
 
    marginTop: 80,
    paddingHorizontal: 5,
    
    width: (windowWidth - 20),
  },

  middlePhoto: {

    width: '100%'   ,
    // Without height undefined it won't work
    height: undefined,
    // figure out your image aspect ratio
    aspectRatio: imageRatio*0.75,
    resizeMode: 'center',
  } ,    
  bottomPrev: {
    height: 100,    
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10
  },
  prevBtn: {
    height: 65,
    width: 140,
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
