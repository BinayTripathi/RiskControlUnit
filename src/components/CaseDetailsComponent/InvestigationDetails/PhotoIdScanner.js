import { StyleSheet,View, Text , Dimensions, TouchableHighlight} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Card from '@components/UI/Card';
import { theme } from '@core/theme';
import { SCREENS, DOC_TYPE } from '@core/constants';



const { width, height } = Dimensions.get('window');

const PhotoIdScanner = ({selectedClaimId, userId}) => {

    const navigation = useNavigation();

    const onClickDigitalId = (documentObj) => {
        if(documentObj.enabled !== true ) return
        navigation.navigate(SCREENS.ImageCaptureScreen, {
            docType: documentObj,
            claimId: selectedClaimId,
            email: userId})
    }


    let capabilities = DOC_TYPE.PHOTO_ID_SCANNER.map((documentType, index)=> {
   
        if(index %2 != 0) {
            let prevDocumentType = DOC_TYPE.PHOTO_ID_SCANNER[index-1]
          return (
    
            <View style= {styles.allIconContainerRow}  key={index}>                
                   
                <TouchableHighlight underlayColor="#ee5e33" style={styles.touchable}
                    onPress={()=> onClickDigitalId(prevDocumentType)}>

                    <View style= {[styles.eachIconContainer, prevDocumentType?.enabled == true ? {} : styles.disabled]}>
                        <Ionicons name={prevDocumentType.icon} size={50} color="orange" />
                        <Text style = {[styles.textBase , styles.label]}>{prevDocumentType.name}</Text> 
                    </View>                     
                </TouchableHighlight>           
                
                <TouchableHighlight underlayColor="#ee5e33" style={styles.touchable}
                     onPress={()=> onClickDigitalId(documentType)} >
                    
                    <View style= {[styles.eachIconContainer,  documentType?.enabled == true ? {} : styles.disabled]}>
                        <Ionicons name={documentType.icon} size={50} color="orange" />
                        <Text style = {[styles.textBase , styles.label]}>{documentType.name}</Text> 
                    </View>  
                </TouchableHighlight>                
                       
            </View>
    
         ) 
        }
        else if(index %2 == 0 && index ==  DOC_TYPE.PHOTO_ID_SCANNER.length-1) 
            return(
              <View style= {styles.allIconContainerRow}  key={index}>
    
                <TouchableHighlight underlayColor="#ee5e33" style={styles.touchable} 
                    onPress={()=> onClickDigitalId(documentType)} >
                    <View style= {[styles.eachIconContainer,  documentType?.enabled == true ? {} : styles.disabled]}>
                        <Ionicons name={documentType.icon} size={50} color="orange" />
                        <Text style = {[styles.textBase , styles.label]}>{documentType.name}</Text> 
                    </View>  
                </TouchableHighlight>        
            </View>
          )
        else return null
      })
    

    return (

        <View style =  {styles.capabilityCardContainer}>                    
        <Card style = {styles.card}>     
            <Text style = {[styles.textBase , styles.capabilityDescription]}>DIGITAL ID SCANNER</Text>     

            {capabilities}
            
        
        </Card>                    
      </View>  
    )
}

const styles = StyleSheet.create({

    capabilityCardContainer : {      
      marginTop: 40,          
      alignContent: 'center',
      alignItems: 'center'       
      },   
    card : { 
        alignItems: 'flex-start', 
        padding: 20, 
        width: width*0.90,
        backgroundColor: theme.colors.capabilitiesCardBackgroundColor,
    },

    allIconContainerRow : {
        flexDirection: 'row',
        marginTop: 16,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent:'space-around',
        width: '95%',

    },
    eachIconContainer : {       
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        borderWidth: 2,
        borderColor: 'orange',
        borderRadius: 20,
        width: 100,
        height: 100,
    },
    disabled: {
        opacity: 0.5,
        backgroundColor: '#eae6e6'
    },
    touchable: {
        borderRadius: 20,
      },
    textBase: {
        color: 'black',
    },
    capabilityDescription: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    label: {
        fontWeight: '500',
        fontSize: 14,
     },  
  })

  export default PhotoIdScanner;