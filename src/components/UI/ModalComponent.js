import {useEffect} from 'react';
import { StyleSheet } from 'react-native';
import { Modal, Portal } from 'react-native-paper';

const ModalComponent = ({children, diplayModal, displayMapHandler, modalTimeout }) => {

  useEffect(()=>{
    if(modalTimeout) {
      console.log('modal timeout')
      modalTimeout();
    }
  },[modalTimeout])



  console.log(diplayModal)

  const dismissHandler = ()=> {
    if(displayMapHandler)
      displayMapHandler()
  }

  return (    
      <Portal>
        <Modal  visible={diplayModal} onDismiss={dismissHandler} contentContainerStyle={Styles.containerStyle} dismissable={true}>
          {children}
        </Modal>
      </Portal>         
  );
};

export default ModalComponent;

const Styles = StyleSheet.create({
  containerStyle:   {
    backgroundColor:'transparent', 
    marginHorizontal: 5
  }
})