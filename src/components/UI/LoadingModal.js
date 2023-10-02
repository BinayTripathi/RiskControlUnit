import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import LottieView  from "lottie-react-native";

export default LoadingModalWrapper = (props) => {

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.shouldModalBeVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View><LottieView source={require("@root/assets/loading.json")} autoPlay loop style={{ height: 50 }} /></View>            
          </View>
        </View>
      </Modal>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    alignItems: 'center',  
  },
 

});

