import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity ,Text, View,} from 'react-native';
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import { Camera } from "expo-camera";
import {useWindowDimensions} from 'react-native';

const cameraMarginTop = 70

export const AudioCapture = ({setPhotoData}) => {
    

    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] =useState(null);
    const [camera, setCamera] = useState(null);
    const [flashMode, setFlashMode] = useState('off');
    const [type, setType] = useState(Camera.Constants.Type.back);
    const video = React.useRef(null);
    const [recording, setRecording] = useState(false)



    const {height: screenHeight, width: screenWidth} = useWindowDimensions();  


    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
            const audioStatus = await Camera.requestMicrophonePermissionsAsync();
            setHasAudioPermission(audioStatus.status === 'granted');
        })();
      }, []);


      const takeVideo = async () => {
        if(camera){
            setRecording(true)
            const { uri, codec = "mp4" }  = await camera.recordAsync({
                VideoQuality:['2160p'],
                maxDuration:10,
                mute:false,
                videoBitrate:5000000
              })            
            console.log(uri);
            setPhotoData(uri);
        }
      }

      const stopVideo = async () => {
        setRecording(false)
        camera.stopRecording()
      }

      const flashModeHandler = () => {
    
        if (flashMode === 'on') {
          setFlashMode(() => 'off');
        } else if (flashMode === 'off') {
          setFlashMode(() =>'on');
        } 
      };

      if (hasCameraPermission === null || hasAudioPermission === null ) {
        return <View />;
      }
      if (hasCameraPermission === false || hasAudioPermission === false) {
        return <Text>No access to camera</Text>;
      }


      let videoButon = (
        <TouchableOpacity  onPress={takeVideo} style={styles.button}>
            <View style={{flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 1000,  borderColor: "black",borderWidth: 1,}}>
                <Entypo name="video-camera" size={35} color="black" />
            </View>          
        </TouchableOpacity>
      );
  
      if (recording) {
        videoButon = (
          <TouchableOpacity
            onPress={stopVideo}
            style={[styles.button, { alignItems: "center", justifyContent: "center"}]}>
            
            <View style={styles.stopRecording}></View>
            
          </TouchableOpacity>
        );
      }
  


      return (
        <View style={[styles.container, {width: screenWidth, paddingHorizontal: 4}]}>

            <View style={styles.top}> 
                <View style={styles.cameraContainer}>
                    <Camera 
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRatio} 
                    type={type}
                    ratio={'4:3'} />
                </View>
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
                    style={[{
                        backgroundColor: type === Camera.Constants.Type.back ? "#0f0f0f" : "#f0f0f0",
                        color: type === Camera.Constants.Type.back ? "white" : "#fff",

                    }, styles.button]}><View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                        {type === Camera.Constants.Type.back
                        ? <AntDesign name="retweet" size={24} color="white" />
                        : <AntDesign name="retweet" size={24} color="black" />
                    }
                    </View>                 
                </TouchableOpacity>

                {videoButon}

                <TouchableOpacity
                    onPress={flashModeHandler}
                    style={styles.button}
                    >
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 1000,  borderColor: "black",borderWidth: 1,}}>
                        <Ionicons  name= { flashMode === "off" ? "flash":"flash-off"} style={{ color: "#fff", fontSize: 24}} />
                    </View>                                                                     
                </TouchableOpacity>
            </View>
              
        </View>
      );

}


const styles = StyleSheet.create({
    container: {
        flex:1,
        maxWidth: 450,
      },
      top: {
        flex: 6,
      },
    cameraContainer: {
        flex: 1,
        marginTop: cameraMarginTop,
        borderRadius: 10
    },
    fixedRatio:{
        flex: 1,
        aspectRatio: 1
    },
    video: {
      alignSelf: 'center',
      width: 350,
      height: 220,
    },
    
    bottom: {
        flex: 1,
        flexDirection: "row",
        height: 125,
       
        alignItems: "center",
        justifyContent: "space-around",
      },

    stopRecording : {
        borderRadius: 50,
        height: 45,
        width: 45,
        backgroundColor: 'red'
     },
    button: {                
        borderRadius: 70,
        height: 65,
        width: 65,
        borderWidth: 1,
    }

  })