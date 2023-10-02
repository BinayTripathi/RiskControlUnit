import { useState } from "react";
import { View, Text , TextInput, StyleSheet, Dimensions } from "react-native"
import Checkbox from 'expo-checkbox';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Button from '@components/UI/Button'
import { SCREENS } from '@core/constants';
import {requestSubmitCaseAction} from '@store/ducks/case-submission-slice'
import { theme } from '@core/theme';
import useNetworkInfo from "../../hooks/useNetworkInfo";


const { width, height } = Dimensions.get('window');
const submitInvestigation = ({selectedClaimId, userId, selectedClaim}) => {
    const [remark, setRemark] = useState(null);
    const [isTermsAccepted, setTermsAccepted] = useState(false);
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [isOnline] = useNetworkInfo();

    return (
    <View style={styles.container}>

        <View style = {{marginTop: 60}}>
          <Text style = {[styles.textBase, styles.description ]}>DOCUMENT SUBMISSION</Text>
        </View>
        <View style={styles.inputContainer}>
            <TextInput
                    placeholder="Enter investigation comments"
                    onChangeText={setRemark}
                    value={remark}
                    multiline={true}
                    numberOfLines={20}
                    keyboardType={
                    Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password' }
                    style={styles.input}  />
        </View>     

        <View style={styles.checkboxContainer}>
        <Checkbox style={styles.checkbox} value={isTermsAccepted} onValueChange={setTermsAccepted} />
        <Text style={styles.label}>I agree to the Terms & Conditions</Text>
      </View>

        <View style={{flexDirection: 'row', marginTop: 20}}>
            <View style={{padding: 10}}>
                <Button mode="elevated" style={[styles.button,!remark  || !isTermsAccepted || !isOnline? 
                {backgroundColor: theme.colors.disabledSubmitButton} : {backgroundColor: theme.colors.submitButton}]} 
                            disabled={remark === null} onPress={() => {
                                if (!remark  || !isTermsAccepted || !isOnline)
                                  return
                                const payload = {
                                    claimId: selectedClaimId, 
                                    email: userId,
                                    beneficiaryId: selectedClaim.beneficiary.beneficiaryId,
                                    Remarks: remark
                                }
                                dispatch(requestSubmitCaseAction(payload))
                                navigation.navigate(SCREENS.CaseList)
                            }
                             }>
                            
                              <FontAwesome name="binoculars" size={20} color="white"/>
                              <Text style={{marginLeft: 2}}>SUBMIT</Text> 
                       
                             </Button>
            </View>

            <View style={{padding: 10}}>
                <Button mode="elevated" style={[styles.button,!remark? {backgroundColor: 'grey'} : {backgroundColor: 'black'}]} 
                            disabled={remark === null} onPress={() => setRemark('')}><AntDesign name="delete" size={20} color="white" />RESET </Button>
            </View>
        </View>
        
    </View>
    )
}

export default submitInvestigation

const styles = StyleSheet.create({
    container: {
      height: height,
      overflow: 'hidden',
      alignItems: "center",      
      paddingHorizontal: 20,
      padding: 50,
    },

    textBase: {
        color: 'black',
      },
      description: {
        fontSize: 24,
        fontWeight: 'bold',
      },
    inputContainer : {
        marginTop: 30,
        //width: '100%',
        //alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 250,
        borderRadius: 20,
        padding: 0,
        shadowOffset: {width: 0, height: 1},
        shadowRadius: 2,
        elevation: 2,
        shadowOpacity: 0.4,

    } ,

    input:{
        alignItems: 'center',
        width: '90%',
        backgroundColor: 'white',        
        textAlignVertical:'top',
        borderRadius: 20,
        padding: 20
      },
      button: {
        marginRight: 5,
        marginBottom: 10
      },
      checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        marginTop: 20
      },
      checkbox: {
        margin: 8,
      },
      label: {
        margin: 8,
      },
})