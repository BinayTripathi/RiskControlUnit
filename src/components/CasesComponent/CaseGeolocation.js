import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux';
import {requestCasesCoordinates} from '@store/ducks/cases-slice'
import MapCallout from '../UI/MapCallout'
import Geolocation from 'react-native-geolocation-service';


import Background from "@components/UI/Background";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


const CaseGeolocation = () => {

  let caseMarkers = useSelector((state) => state.cases.caseCoordinates);
  const isLoading = useSelector((state) => state.cases.loading)
  const error = useSelector((state) => state.cases.error)
  const isConnected = useSelector(state => state.network.isConnected);
  const userId = useSelector(state => state.user.userId)

  const navigation = useNavigation()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      console.log(location)

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();
  }, []);


  useEffect(() => {
    if (isFocused && isConnected) {
      console.log('Fetching coordinates')
      dispatch(requestCasesCoordinates(userId))  
    }  

  }, [dispatch, isFocused])




  let mapMarkers = () => {

    if (caseMarkers === undefined || caseMarkers[0]?.coordinate === undefined) return null
    console.log(caseMarkers)
    return caseMarkers.map((eachCase) => 
        <Marker key ={eachCase.claimId} 
                coordinate={{ latitude:eachCase.coordinate.lat, longitude: eachCase.coordinate.lng }}
                title={eachCase.policyNumber} description={eachCase.address}>
                  <MapCallout title={eachCase.policyNumber} description={eachCase.address} claimId={eachCase.claimId}></MapCallout>
                </Marker >) 
              }

  return (
    
    <Background>
      <View style={styles.container}>
        
        {initialRegion !== null && (
          <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={initialRegion}
                mapPadding={{ top: 100, right: 100, bottom: 100, left: 100 }}>
            
          {true && (
          <View>
              <Marker
                coordinate={{
                  latitude: currentLocation?.latitude === null? 28.7 : currentLocation?.latitude,
                  longitude: currentLocation?.longitude === null ? 77.1 : currentLocation?.longitude
                  //latitude: 28.7,
                  //longitude: 77.1
                }}
                title="Your Location"
                image={require("@root/assets/agent.jpeg")}
              />
              
              {mapMarkers()}
                
            </View>
            )}
          </MapView>
        )}

        
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 90,      
    justifyContent: 'center',
    paddingBottom: 10
  },
  map: {
    width : '100%' | windowWidth *0.95 ,
    height : '100%' | windowHeight * 0.80 ,
    borderRadius: 10,
    borderWidth: 1
  },
});

export default CaseGeolocation;