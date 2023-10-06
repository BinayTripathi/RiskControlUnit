import React, { useState, useEffect, useRef } from "react";
import { FontAwesome, AntDesign, Ionicons } from '@expo/vector-icons';
import { Camera } from "expo-camera";
import * as FaceDetector from 'expo-face-detector';
import {useWindowDimensions} from 'react-native';

import { StyleSheet, TouchableOpacity, View, Alert,Text } from "react-native";

  
const ImageCapture = ({setPhotoData, docType}) => {

  const [startCamera,setStartCamera] = React.useState(false)
  const [flashMode, setFlashMode] = useState('off');
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const {height: screenHeight, width: screenWidth} = useWindowDimensions();  
  const [faceData, setFaceData] = React.useState([]);
  
  useEffect(() => {
    permission();
    docType === 'BENIFICIARY-PHOTO' ? setType(Camera.Constants.Type.front) : setType(Camera.Constants.Type.back)
  }, []);

  const permission = async () => {


    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      // start the camera
      setStartCamera(true)
    } else {
      Alert.alert('Access denied')
    }
    setHasPermission(status);
  };


  const flashModeHandler = () => {
    
    if (flashMode === 'on') {
      setFlashMode(() => 'off');
    } else if (flashMode === 'off') {
      setFlashMode(() =>'on');
    } 
  };

  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);
    
  }


  


  
  const takePhoto = async () => {
    const {base64} = await camera.current.takePictureAsync(options={base64:true,quality:0, isImageMirror: false});
    setPhotoData(base64.replaceAll(" ","+"));
  };



  let boundingArea = faceData.map((face, index) => {
    return (
      <View key={index} style= {[styles.facebox, {left: face.bounds.origin.x, 
        top: face.bounds.origin.y, 
        width: face.bounds.size.width,
        height: face.bounds.size.height}]}/> 
    );
  });


  let camera = useRef(null);

  return (
    <View style={[styles.container, {width: screenWidth, paddingHorizontal: 4}]}>     
          
        <View style={styles.top}>          
          <Camera style={styles.cameraContainer} 
              ref={camera} 
              type={type} 
              flashMode={flashMode === "on" ? "on": "off"}
              onFacesDetected={handleFacesDetected}
              faceDetectorSettings={{
                mode: FaceDetector.FaceDetectorMode.fast,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                runClassifications: FaceDetector.FaceDetectorClassifications.none,
                minDetectionInterval: 100,
                tracking: true
              }}/>
              {boundingArea}
            
        </View>

        <View style={styles.bottom}>
            
          <TouchableOpacity
              onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
              style={{
                backgroundColor: type === Camera.Constants.Type.back ? "#0f0f0f" : "#f0f0f0",
                color: type === Camera.Constants.Type.back ? "white" : "#fff",
                borderRadius: 70,
                height: 65,
                width: 65,
              }}><View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                {type === Camera.Constants.Type.back
                  ? <AntDesign name="retweet" size={24} color="white" />
                  : <AntDesign name="retweet" size={24} color="black" />
              }
              </View>                 
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <FontAwesome name="camera" style={{ color: "#fff", fontSize: 40}}  />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={flashModeHandler}
              style={{                  
                borderRadius: 70,
                height: 65,
                width: 65,
              }}
            >
              <View style={{flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 1000,  borderColor: "white",borderWidth: 1,}}>
                <Ionicons  name= { flashMode === "off" ? "flash":"flash-off"} style={{ color: "#fff", fontSize: 24}} />
              </View>
            </TouchableOpacity>
        </View>
      
    </View>
  );
}

export default ImageCapture;

const styles = StyleSheet.create({
    container: {
      flex:1,
      maxWidth: 450,
    },
    cameraContainer: {
      flex: 1,
    },
    top: {
      flex: 6,
    },
    bottom: {
      flex: 1,
      flexDirection: "row",
      height: 125,
     
      alignItems: "center",
      justifyContent: "space-around",
    },
    button: {
      height: 65,
      width: 65,
      borderRadius: 1000,
      borderColor: "white",
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    facebox: {
      borderColor: 'red',
      borderWidth: 2,
      position: 'absolute',
    }
  });