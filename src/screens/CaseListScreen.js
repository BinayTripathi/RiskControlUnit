import {useState, useEffect} from "react";
import { StyleSheet,  View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from 'react-native-tab-view';
import * as Location from "expo-location";

import {secureGet} from '@helpers/SecureStore'
import CaseList from "@components/CasesComponent/CaseList";
import CaseGeolocation from "@components/CasesComponent/CaseGeolocation"
import {SECURE_USER_KEY, SECURE_USER_PIN} from '../core/constants'






export default function CaseListScreen() {

  useEffect(() => {

   const getUserID = async() => {
      try{
        const user = await secureGet(SECURE_USER_KEY)
        console.log(`Within login ${user}`)
        setUserId(user)
      } catch (error) {
        console.log(error)
      }
      
      }
  

    const getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

    };

    (async()=> {
      await getUserID()
      await getLocationPermission()
    })()

   // getLocationPermission();

  }, []);

  const [userId,setUserId] = useState('')
  const [userLocation, setUserLocation] = useState(null)  
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'ListView' },
    { key: 'second', title: 'MapView' },
  ]);

  const ListView = () => (
    <CaseList reloadProp={index}  userId = {userId}/>
);

const MapView = () => (
   <CaseGeolocation reloadProp={index} userLoc = {userLocation} userId = {userId}/>
);
console.log(userLocation)
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
