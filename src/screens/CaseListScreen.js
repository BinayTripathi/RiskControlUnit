import { StyleSheet,  View, } from "react-native";

import CaseList from "@components/CasesComponent/CaseList";


export default function CaseListScreen() {

 
  return (
    <View style={styles.container}>
      <CaseList/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
  }
});
