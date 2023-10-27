import { StyleSheet,View, Text , Dimensions} from 'react-native';
import Card from '@components/UI/Card';
import { theme } from '@core/theme';


const { width, height } = Dimensions.get('window');

const FormInitiator = () => {

    return (

        <View style =  {styles.capabilityCardContainer}>                    
        <Card style = {styles.card}>     
  
        
        </Card>                    
      </View>  
    )
}

const styles = StyleSheet.create({

    capabilityDescription: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    capabilityCardContainer : {      
      marginTop: 40,          
      alignContent: 'center',
      alignItems: 'center'       
      }, 
  
    card : { 
    alignItems: 'flex-start', 
    padding: 20, 
    width: width*0.75,
    backgroundColor: theme.colors.capabilitiesCardBackgroundColor
    },
  
  })

  export default FormInitiator;