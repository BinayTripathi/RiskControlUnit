import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

import Background from "@components/UI/Background";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const reports= [
  {
    "id": 45981,
    "time": "2020-01-14T04:20:00.000Z",
    "size": 125,
    "location": "4 ESE GAMALIEL",
    "city": "GAMALIEL",
    "county": "MONROE",
    "state": "KY",
    "lat": 36.62,
    "lon": -85.73,
    "comments": "PUBLIC REPORT RELAYED BY MEDIA. (LMK)",
    "filename": null,
    "created_at": "2020-03-05T14:54:06.650Z",
    "updated_at": "2020-03-05T14:54:06.650Z"
  }]

const MapLocation = () => {
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

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();
  }, []);

  const mapMarkers = () => {
    return reports.map((report) => <Marker
      key={report.id}
      coordinate={{ latitude: report.lat, longitude: report.lon }}
      title={report.location}
      description={report.comments}
    >
    </Marker >)
  }
  return (
    
    <Background>
      <View style={styles.container}>
        
        {initialRegion !== null && (
          <MapView style={styles.map} initialRegion={initialRegion}>
            
          {currentLocation && (
          <View>
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Your Location"
              />
              <Marker
                        coordinate={{ latitude: -37.839677894796516, longitude: 145.16481336623696 }}
                        title='iCheckify map'
                        description='This is where the magic beginz !'
                    >
                    </Marker >
            </View>
            )}
          </MapView>
        )}
        {/* Rest of your code */}
        
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

export default MapLocation;