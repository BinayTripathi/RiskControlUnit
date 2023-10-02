import { useState } from "react";
import { StyleSheet, View,} from "react-native";

import ImageCapture from '../components/ImageCaptureComponent/ImageCapture'
import ImagePreview from "../components/ImageCaptureComponent/ImagePreview";
import Background from "../components/UI/Background";


const ImageCaptureScreen = ({ route }) => {
  
  const [photoData, setPhotoData] = useState(); 

  const claimId = route.params?.claimId
  const docType = route.params?.docType
  const email = route.params?.email


  const imageCaptureSceen =  (
    <Background>
        <View style={styles.container}>
          <ImageCapture setPhotoData={setPhotoData} docType = {docType}/>
        </View>  
        </Background>
     
    )

  const imagePreviewScreen =  (
    <Background>
      <View style={styles.container}>
        <ImagePreview photoData= {photoData} setPhotoData={setPhotoData} claimId = {claimId} docType = {docType} email = {email}/>
      </View>  
    </Background>
  )

 if(!photoData)    
    return imageCaptureSceen
   else
    return imagePreviewScreen

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ImageCaptureScreen;
