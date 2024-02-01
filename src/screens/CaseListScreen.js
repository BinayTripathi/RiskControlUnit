import {useState, useEffect} from "react";
import { StyleSheet,  View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from 'react-native-tab-view';
import * as Location from "expo-location";

import CaseList from "@components/CasesComponent/CaseList";
import CaseGeolocation from "@components/CasesComponent/CaseGeolocation"






export default function CaseListScreen() {

  useEffect(() => {

    const getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

    };

    getLocationPermission();

  }, []);
  const [userLocation, setUserLocation] = useState(null)  
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'ListView' },
    { key: 'second', title: 'MapView' },
  ]);

  const ListView = () => (
    <CaseList reloadProp={index}/>
);

const MapView = () => (
   <CaseGeolocation reloadProp={index} userLoc = {userLocation}/>
);

const renderScene = SceneMap({
  first: ListView,
  second: MapView,
});
  return (

    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      tabBarPosition= "bottom"
      options={{unmountOnBlur: true}}
    />

    
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop: 50
    
  }
});
