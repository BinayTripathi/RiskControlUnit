import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { actuatedNormalize, actuatedNormalizeVertical} from "@core/PixelScaling";
import ElevatedSurface from '@components/UI/ElevatedSurface'
import RoundButton from '@components/UI/RoundButton'
import { Entypo , FontAwesome} from '@expo/vector-icons';
import {DOC_TYPE, SCREENS } from '@core/constants';

const FormAudioVideoPart = ({selectedClaimId, userId}) => {

    const navigation = useNavigation();

    const onClickDigitalId = (documentObj) => {
        if(documentObj.enabled !== true ) return
        navigation.navigate(SCREENS.ImageCaptureScreen, {
            docType: documentObj,
            claimId: selectedClaimId,
            email: userId})
    }
    
    return (
        <ElevatedSurface style={styles.surface}>   
            <RoundButton style={styles.button} onPressHandler = {() => onClickDigitalId(DOC_TYPE.Video[0])}>
                <Entypo name="video-camera" size={50} color="#083596" />
            </RoundButton>

            <RoundButton style={styles.button}><FontAwesome name="microphone" size={50} color="#22c970" /></RoundButton>
        </ElevatedSurface>
        )
  
    };

    export default FormAudioVideoPart;

const styles = StyleSheet.create({
  surface: {
    height: actuatedNormalizeVertical(120),
    marginTop: actuatedNormalizeVertical(20),
  },

  button: {
    elevation: 5, // Android
    height:  actuatedNormalizeVertical(80),
    width: actuatedNormalize(70),
    borderRadius: actuatedNormalize(40),
  },
});