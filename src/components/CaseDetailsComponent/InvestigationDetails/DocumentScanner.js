import { StyleSheet,View, Text , Dimensions, TouchableHighlight, Image} from 'react-native';
import Card from '@components/UI/Card';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@core/theme';
import { useNavigation } from '@react-navigation/native';
import { SCREENS, DOC_TYPE, checkLoading, checkSuccess } from '@core/constants';
import * as Speech from 'expo-speech';


const { width, height } = Dimensions.get('window');
const iconSize = 50;
const DocumentScanner = ({selectedClaimId, userId, caseUpdates}) => {

  const navigation = useNavigation();

  const onClickDigitalId = (documentObj) => {

    navigation.navigate(SCREENS.ImageCaptureScreen, {
        docType: documentObj,
        claimId: selectedClaimId,
        email: userId})
}

const speechHandler = (documentObj) => {
  Speech.speak(documentObj.speach);
};

  let capabilities = DOC_TYPE.DOCUMENT_SCANNER.map((documentType, index)=> {
   
    if(index %2 != 0) {
      let prevDocumentType = DOC_TYPE.DOCUMENT_SCANNER[index-1]
      return (

        <View style= {styles.allIconContainerRow}  key={index}>                 
            <View>
              <TouchableHighlight underlayColor="#ee5e33" style={styles.touchable}
                  disabled =  {prevDocumentType?.enabled == true ? false: true}
                  onPress={()=> onClickDigitalId(prevDocumentType)}>
                  <View style= {[styles.eachIconContainer, prevDocumentType?.enabled == true ? {} : styles.disabled]}>

                          { checkLoading(prevDocumentType, caseUpdates) && <Image source={require('@root/assets/loading.gif')} style={styles.statusImage} /> }
                          { checkSuccess(prevDocumentType, caseUpdates) && <Image source={require('@root/assets/checkmark.png')} style={styles.statusImage} /> }

                      <View style={styles.imageContainer} >
                        <Image source = {{uri:`${prevDocumentType.icon}`}} style={styles.image} />
                      </View>
                      <Text style = {[styles.textBase , styles.label]}>{prevDocumentType.name}</Text> 
                  </View>                    
              </TouchableHighlight>    
              <TouchableHighlight  onPress={()=> speechHandler(prevDocumentType)}>        
                  <Ionicons name='volume-medium' size={iconSize-30} color="orange" />
              </TouchableHighlight>
            </View>       
            
            <View>
              <TouchableHighlight underlayColor="#ee5e33" style={styles.touchable} 
                disabled =  {documentType?.enabled == true ? false: true}
                onPress={()=> onClickDigitalId(documentType)} >
                  <View style= {[styles.eachIconContainer,  documentType?.enabled == true ? {} : styles.disabled]}>

                      { checkLoading(documentType, caseUpdates) && <Image source={require('@root/assets/loading.gif')} style={styles.statusImage} /> }
                      { checkSuccess(documentType, caseUpdates) && <Image source={require('@root/assets/checkmark.png')} style={styles.statusImage} /> }                        
                        

                      <View style={styles.imageContainer} >
                        <Image source = {{uri:`${documentType.icon}`}} style={styles.image} />
                      </View>
                      <Text style = {[styles.textBase , styles.label]}>{documentType.name}</Text>                       
                  </View>
              </TouchableHighlight>       
              <TouchableHighlight  onPress={()=> speechHandler(documentType)}>        
                    <Ionicons name='volume-medium' size={iconSize-30} color="orange" />
              </TouchableHighlight>
            </View>                
                   
        </View>

    ) }
    else if(index %2 == 0 && index ==  DOC_TYPE.DOCUMENT_SCANNER.length-1) 
        return(
          <View style= {styles.allIconContainerRow}  key={index}>

            <View>
              <TouchableHighlight underlayColor="#ee5e33"  style={styles.touchable}
                disabled =  {documentType?.enabled == true ? false: true}
                onPress={()=> onClickDigitalId(documentType)}>
                    <View style= {[styles.eachIconContainer,  documentType?.enabled == true ? {} : styles.disabled]}>

                        { checkLoading(documentType, caseUpdates) && <Image source={require('@root/assets/loading.gif')} style={styles.statusImage} /> }
                        { checkSuccess(documentType, caseUpdates) && <Image source={require('@root/assets/checkmark.png')} style={styles.statusImage} /> }                        
                        
                        <View style={styles.imageContainer} >
                          <Image source={{uri:`${documentType.icon}`}} style={styles.image} />
                        </View>
                        <Text style = {[styles.textBase , styles.label]}>{documentType.name} </Text>                       
                    </View>
                </TouchableHighlight>      
                <TouchableHighlight  onPress={()=> speechHandler(documentType)}>        
                      <Ionicons name='volume-medium' size={iconSize-30} color="orange" />
                </TouchableHighlight>
            </View>     
        </View>
      )
    else return null
  })

  return (

    <View style =  {styles.capabilityCardContainer}>                    
    <Card style = {styles.card}>     
        <Text style = {[styles.textBase , styles.capabilityDescription]}>DOCUMENT UPLOADER</Text>      
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
    width: '100%',

},
eachIconContainer : {       
  alignContent: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 5,
  padding: 4,
  borderWidth: 2,
  borderColor: 'orange',
  borderRadius: 20,
  width: 120,
  height: 120,
},
disabled: {
    opacity: 0.5,
    backgroundColor: '#eae6e6'
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
 statusImage : {
  width: 30,
  height: 30,
  borderRadius: 15,
  resizeMode: 'contain',
  transform: [{ translateX: 50 }, { translateY: 0 }],
}
})

  export default DocumentScanner;