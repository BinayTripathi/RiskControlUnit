import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, Alert,Text } from "react-native";
import { FontAwesome, AntDesign, Ionicons } from '@expo/vector-icons';
import { Camera } from "expo-camera";
import * as FaceDetector from 'expo-face-detector';
import {useWindowDimensions} from 'react-native';

import Paragraph from '@components/UI/Paragraph'
import { DOC_TYPE } from '@core/constants';

  
const ImageCapture = ({setPhotoData, docType, setBothEyeOpen, setSmiling}) => {

  const [startCamera,setStartCamera] = React.useState(false)
  const [flashMode, setFlashMode] = useState('off');
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const {height: screenHeight, width: screenWidth} = useWindowDimensions();  
  const [faceData, setFaceData] = React.useState([]);


  let isSmiling = false;
  let eyesShut = false
  
  
  useEffect(() => {
    permission();
      setType(docType.cameraType)
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

    if(faceData.length < docType.faceCount)
      return

      if(docType.name === DOC_TYPE.PHOTO_ID_SCANNER.FACE_READER.name) {
        setBothEyeOpen(!eyesShut)
        setSmiling(isSmiling)
      }
      
    const {base64} = await camera.current.takePictureAsync(options={base64:true,quality:0, isImageMirror: false});
    setPhotoData(base64.replaceAll(" ","+"));
  };

  let boundingArea = faceData.length >= docType.faceCount? faceData.map((face, index) => {
    let eyesShut = face.rightEyeOpenProbability < 0.4 && face.leftEyeOpenProbability < 0.4;
    const winking = !eyesShut && (face.rightEyeOpenProbability < 0.4 || face.leftEyeOpenProbability < 0.4);
    let isSmiling = face.smilingProbability > 0.7;

    return (
      <View key={index} style= {[styles.facebox, {left: face.bounds.origin.x, 
        top: face.bounds.origin.y, 
        width: face.bounds.size.width,
        height: face.bounds.size.height}]}> 
        {docType.name === DOC_TYPE.PHOTO_ID_SCANNER.FACE_READER.name && eyesShut && <Paragraph style={[styles.noFaceWarning, {left : 50, top : screenHeight/2}]}>{ `Left Eye : ${face.leftEyeOpenProbability}, Right Eye : ${face.rightEyeOpenProbability}`} </Paragraph>}
        {docType.name === DOC_TYPE.PHOTO_ID_SCANNER.FACE_READER.name && isSmiling && <Paragraph style={[styles.noFaceWarning, {left : 50, top : screenHeight/1.6}]}>{ `Smile : ${face.smilingProbability}`} </Paragraph>}
        </View>
    );
  }) : docType.name !== DOC_TYPE.PHOTO_ID_SCANNER.OTHERS.name && faceData.length < docType.faceCount?
                  <Paragraph style={[styles.noFaceWarning, {left : 50, top : screenHeight/2}]}> NOT ENOUGH FACES DETECTED</Paragraph> : '';


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
                runClassifications: FaceDetector.FaceDetectorClassifications.all,
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

            <TouchableOpacity style={styles.button} onPress={takePhoto} disabled={faceData.length < docType.faceCount}>
              <FontAwesome name="camera" style={
               { color: "white", fontSize: 40}}  />
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
      marginTop: 70,
      borderRadius: 10
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
      borderColor: 'green',
      borderWidth: 2,
      position: 'absolute',
    },
    noFaceWarning : {
      position: 'absolute',
      fontWeight: '900',
      fontSize: 16,
      color: 'red'
    }
  });