import { StyleSheet,View, Text , Dimensions, TouchableHighlight, Image} from 'react-native';
import Card from '@components/UI/Card';
import { theme } from '@core/theme';
import { useNavigation } from '@react-navigation/native';
import { SCREENS, DOC_TYPE } from '@core/constants';


const { width, height } = Dimensions.get('window');

const DocumentScanner = ({selectedClaimId, userId}) => {

  const navigation = useNavigation();

  return (

    <View style =  {styles.capabilityCardContainer}>                    
    <Card style = {styles.card}>     
        <Text style = {[styles.textBase , styles.capabilityDescription]}>DOCUMENT UPLOADER</Text>     
        <View style= {styles.allIconContainerRow}>                
               
            <TouchableHighlight underlayColor="#ee5e33" style={styles.touchable}
                onPress={() => { navigation.navigate(SCREENS.ImageCaptureScreen, {
                  docType: DOC_TYPE.DOCUMENT_SCANNER.PAN,
                  claimId: selectedClaimId,
                  email: userId
                })
                return}}>
                <View style= {styles.eachIconContainer}>
                    <View style={styles.imageContainer} >
                      <Image source={require('@root/assets/PAN.webp')} style={styles.image} />
                    </View>
                    <Text style = {[styles.textBase , styles.label]}>PAN</Text> 
                </View>                    
            </TouchableHighlight>           
            
            <TouchableHighlight underlayColor="#ee5e33" onPress={()=> console.log('clicked')} style={styles.touchable}>
                <View style= {styles.eachIconContainer}>
                    <View style={styles.imageContainer} >
                      <Image source={require('@root/assets/Adhar.png')} style={styles.image} />
                    </View>
                    <Text style = {[styles.textBase , styles.label]}>Adhar </Text>                       
                </View>
            </TouchableHighlight>                
                   
        </View>

        <View style= {styles.allIconContainerRow}>

            <TouchableHighlight underlayColor="#ee5e33" onPress={()=> console.log('clicked')} style={styles.touchable}>
                <View style= {styles.eachIconContainer}>
                    <View style={styles.imageContainer} >
                      <Image source={require('@root/assets/passport.png')} style={styles.image} />
                    </View>
                    <Text style = {[styles.textBase , styles.label]}>Passport</Text>                              
                </View>   
            </TouchableHighlight>

            <TouchableHighlight underlayColor="#ee5e33" onPress={()=> console.log('clicked')} style={styles.touchable}>
                <View style= {styles.eachIconContainer}>
                    <View style={styles.imageContainer} >
                      <Image source={require('@root/assets/driver-licence.jpg')} style={styles.image} />
                    </View>
                    <Text style = {[styles.textBase , styles.label]}>Driving Licence</Text>                              
                </View>                
            </TouchableHighlight>
        </View>

        <View style= {styles.allIconContainerRow}>

            <TouchableHighlight underlayColor="#ee5e33" onPress={()=> console.log('clicked')} style={styles.touchable}>
                <View style= {styles.eachIconContainer}>
                    <View style={styles.imageContainer} >
                      <Image source={require('@root/assets/OtherDocument.webp')} style={styles.image} />
                    </View>
                    <Text style = {[styles.textBase , styles.label]}>Other Document</Text>                              
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
imageContainer: {
  width: 60,
  height: 60, 
  borderRadius: 25,
},
image : {
  flex: 1,
  width: '100%',
  height: '100%',
  resizeMode: 'contain',
},
touchable: {
    borderRadius: 8,
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

  export default DocumentScanner;