import React, { useEffect, useState, useRef } from "react";
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
import { Searchbar } from 'react-native-paper';
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
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = useNavigation()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const mapRef = useRef(null);
  const timeout = 400;
  let animationTimeout;

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();
    if (mapRef) {
      console.log(mapRef);
    }
    autoFocus()
  }, []);


  useEffect(() => {
    if (isFocused && isConnected) {
      console.log('Fetching coordinates')
      dispatch(requestCasesCoordinates(userId))        
    }  

  }, [dispatch, isFocused])

  const onChangeSearch = query => setSearchQuery(query);

  const searchCasesByName = (caseToCheck) => {
    if(searchQuery.length != 0)
      return caseToCheck.policyNumber.startsWith(searchQuery)
    
    return true
  }

  const retriveAllCases = () => {
    return caseMarkers !== undefined ?caseMarkers.filter(searchCasesByName).reverse() : null;
  }

  const focusMap = (focusMarkers, animated) => {
    focusMarkers.push("currentLocation")
    console.log(`Markers received to populate map: ${focusMarkers}`);
    mapRef.current.fitToSuppliedMarkers(focusMarkers, animated);
  }
  const autoFocus = () => {
  
    console.log('inside')
      if (mapRef.current) {       
        console.log('outside')
        animationTimeout = setTimeout(() => { focusMap(caseMarkers.map((eachCase) => eachCase.claimId ), true) , timeout });
    }
  }

  let mapMarkers = () => {

    if(retriveAllCases() === null || retriveAllCases().length === 0 || retriveAllCases()[0]?.coordinate === undefined) return null

    return caseMarkers.map((eachCase) => 
        <Marker key ={eachCase.claimId} 
                identifier={eachCase.claimId}
                coordinate={{ latitude:eachCase.coordinate.lat, longitude: eachCase.coordinate.lng }}
                title={eachCase.policyNumber} description={eachCase.address}>
                  <MapCallout title={eachCase.policyNumber} description={eachCase.address} claimId={eachCase.claimId}></MapCallout>
                </Marker >) 
              }

  return (
    
    <Background>
      
      <View style={styles.container}>

         <View style= {styles.searchBoxContainer}>
                  <Searchbar placeholder="Search By Name/Policy"
                        onChangeText={onChangeSearch}
                        value={searchQuery}/>
        </View>

        <View style={styles.mapContainer}>
          

          {initialRegion !== null && (
            <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={initialRegion}
                  mapPadding={{ top: 100, right: 100, bottom: 100, left: 100 }} >
              
            {true && (
            <View>
                <Marker identifier={"currentLocation"}
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

      </View>
      
      
    </Background>
  );
};

const styles = StyleSheet.create({

  container: {
    flex:1,
    marginTop: 90,      
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },

  searchBoxContainer : {
    flex: 1,
    width: 320,
    height: 40,
    alignContent: 'center',
  },
  searchBox: {
    width: 320
  },
  mapContainer: { 
    marginTop:30,   
    flex: 9,
    width:  windowWidth *0.95,
    padding: 0,       
    alignContent: 'center',
    borderRadius: 30,
    overflow: 'hidden'
  },
  map: {
    width : '100%' ,
    height : '100%' ,
    borderRadius: 10,
    borderWidth: 1
  },
  
});

export default CaseGeolocation;