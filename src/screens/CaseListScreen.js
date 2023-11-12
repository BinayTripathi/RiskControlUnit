import {useState} from "react";
import { StyleSheet,  View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from 'react-native-tab-view';

import CaseList from "@components/CasesComponent/CaseList";
import MapLocation from "@components/CasesComponent/MapLocation"


const ListView = () => (
      <CaseList/>
);

const MapView = () => (
     <MapLocation/>

);

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const renderScene = SceneMap({
  first: ListView,
  second: MapView,
});

export default function CaseListScreen() {

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'ListView' },
    { key: 'second', title: 'MapView' },
  ]);
  return (

    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      tabBarPosition= "bottom"
    />

    
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop: 50
    
  }
});
