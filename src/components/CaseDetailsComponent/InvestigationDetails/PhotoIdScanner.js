import { StyleSheet,View, Text , Dimensions, TouchableHighlight} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Card from '@components/UI/Card';
import { theme } from '@core/theme';
import { SCREENS, DOC_TYPE } from '@core/constants';



const { width, height } = Dimensions.get('window');

const PhotoIdScanner = ({selectedClaimId, userId}) => {

    const navigation = useNavigation();

    return (

        <View style =  {styles.capabilityCardContainer}>                    
        <Card style = {styles.card}>     
            <Text style = {[styles.textBase , styles.capabilityDescription]}>DIGITAL ID SCANNER</Text>     
            <View style= {styles.allIconContainerRow}>                
                   
                <TouchableHighlight style={styles.touchable} underlayColor="#ee5e33" 
                    onPress={() => navigation.navigate(SCREENS.ImageCaptureScreen, {
                                docType: DOC_TYPE.PHOTO_ID_SCANNER.FACE_READER,
                                claimId: selectedClaimId,
                                email: userId
                              })} >
                    <View style= {styles.eachIconContainer}>
                        <Ionicons name="camera" size={50} color="orange" />
                        <Text style = {[styles.textBase , styles.label]}>FaceReader</Text> 
                    </View>                    
                </TouchableHighlight>           
                
                <TouchableHighlight style={styles.touchable} underlayColor="#ee5e33" 
                    onPress={() => navigation.navigate(SCREENS.ImageCaptureScreen, {
                                docType: DOC_TYPE.PHOTO_ID_SCANNER.DUAL_FACE_READER,
                                claimId: selectedClaimId,
                                email: userId
                              })} >
                    <View style= {styles.eachIconContainer}>
                        <Ionicons name="people-circle" size={50} color="orange" />
                        <Text style = {[styles.textBase , styles.label]}>Dual </Text>   
                        <Text style = {[styles.textBase , styles.label]}>FaceReader</Text>   
                    </View>
                </TouchableHighlight>                
                       
            </View>

            <View style= {styles.allIconContainerRow}>

                <TouchableHighlight style={styles.touchable} underlayColor="#ee5e33" 
                     onPress={() => navigation.navigate(SCREENS.ImageCaptureScreen, {
                        docType: DOC_TYPE.PHOTO_ID_SCANNER.HOUSE,
                        claimId: selectedClaimId,
                        email: userId
                      })} >
                    <View style= {styles.eachIconContainer}>
                        <Ionicons name="home" size={50} color="orange" />
                        <Text style = {[styles.textBase , styles.label]}>House Images</Text>                              
                    </View>   
                </TouchableHighlight>

                <TouchableHighlight style={styles.touchable} underlayColor="#ee5e33" 
                     onPress={() => navigation.navigate(SCREENS.ImageCaptureScreen, {
                        docType: DOC_TYPE.PHOTO_ID_SCANNER.OTHERS,
                        claimId: selectedClaimId,
                        email: userId
                      })} >
                    <View style= {styles.eachIconContainer}>
                        <Ionicons name="eye" size={50} color="orange" />
                        <Text style = {[styles.textBase , styles.label]}>Other Images</Text>                              
                    </View>                
                </TouchableHighlight>
            </View>
            
            
        
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
        padding: 4,
        borderWidth: 2,
        borderColor: 'orange',
        borderRadius: 20,
        width: 100,
        height: 100,
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