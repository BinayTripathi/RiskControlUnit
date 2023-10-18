import { useState } from "react";
import { View, Text , TextInput, StyleSheet, Dimensions , ScrollView} from "react-native"
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
import  CustomTextInput  from "../UI/TextInput";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import Slider from '@react-native-community/slider';
import CustomDateTimePicker from '@components/UI/CustomDateTimePicker'
import { useDebounce } from "use-debounce";


const { width, height } = Dimensions.get('window');
const submitInvestigation = ({selectedClaimId, userId, selectedClaim}) => {

    const [metBeneficiary, setMetBeneficiary] = useState(false);
    const [metNeighbor, setMetNeighbor] = useState(false);
    const [financialStatus, setFinancialStatus] = useState(0.5)

    const [personMet, setPersonMet] = useState('')
    const [debouncedPersonMet] = useDebounce(personMet, 5000);

    //const [open, setOpen] = useState(false);
    const [dateTime, setDateTime] = useState('');
    
    console.log(dateTime)

    const [propertyOwnership, setPropertyOwnership] = useState("owned");
    const [remark, setRemark] = useState(null);
    const [isTermsAccepted, setTermsAccepted] = useState(false);
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [isOnline] = useNetworkInfo();

    let financialStatusString = financialStatus === 0 ? 'LOW' 
      :  financialStatus === 0.5 ? 'MEDIUM' : 'HIGH'

    const BenifiaryFormPart = () => {      

      return <View style={{ marginTop: 10, marginBottom: 20, paddingBottom: 10, marginHorizontal: 10, borderBottomColor: 'grey', borderBottomWidth: 3 }}>
        <Text style={styles.label1}>Ownership of residence</Text>
      <RadioButtonGroup containerStyle={{ marginBottom: 10 }}
                        selected={propertyOwnership}
                        onSelected={(value) => setPropertyOwnership(value)}
                        radioBackground="green">
        <RadioButtonItem value="owned" label="OWNED" />
        <RadioButtonItem value="rented" label="RENTED" />
      </RadioButtonGroup>

     

      <Text style={styles.label1}>Perceived financial status</Text>
      <Text style={[{marginLeft: 10, fontWeight: 'bold',color: 'red'}]}>{financialStatusString}</Text>
      <View style = {{borderColor: 'black', borderWidth: 1, marginHorizontal: 20, marginBottom: 20}}> 
        <Slider style={{width: 200, height: 40}}  minimumValue={0} maximumValue={1} step= {0.5} minimumTrackTintColor="#5a5757"
          maximumTrackTintColor="#000000" value={financialStatus} onValueChange = {setFinancialStatus }/>
      </View>
     
     
      
    </View>
    }

    const NeighbourFormPart = () => {

      const handlePersonMet = (event) => {
        const value = event.target.value;
        setPersonMet(value);
      };

      return <View style= {{paddingBottom : 10}}>
                <CustomTextInput onChangeText={setPersonMet} value={personMet} label="Name of the neighbour met" 
                  underlineColor='#6e6d6d' style= {styles.customInputBox}/>
                
                <Text style={styles.label1}> Time when met with Neighbour</Text>  
                <CustomDateTimePicker   dateTimeInParent={dateTime} setDateTimeInParent = {setDateTime} />
               
              </View>
    }



    let benificaryForm = metBeneficiary === true ?<BenifiaryFormPart/> : ""
    let neighbourForm = metNeighbor === true ? NeighbourFormPart() : ""

    return (
    <View style={styles.container}>

        <View style = {{marginTop: 50}}>
          <Text style = {[styles.textBase, styles.description ]}>FORM TEMPLATE</Text>
        </View>

        <ScrollView style={styles.scrollView}>
        <View style={styles.questionaireContainer}>

            <View style={[styles.checkboxContainer, { marginBottom: 0, marginTop: 10,}]}>
              <Checkbox style={styles.checkbox} value={metBeneficiary} onValueChange={setMetBeneficiary} />
              <Text style={styles.label}>Met beneficiary</Text>
            </View>

              {benificaryForm}



            <View style={[styles.checkboxContainer, { marginBottom: 0, marginTop: 10,}]}>
              <Checkbox style={styles.checkbox} value={metNeighbor} onValueChange={setMetNeighbor} />
              <Text style={styles.label}>Met Neighbour</Text>
            </View>

            {neighbourForm}       

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
                                      Question1: propertyOwnership,
                                      Question2: financialStatusString,
                                      Question3: personMet,
                                      Question4: dateTime,
                                      Remarks: remark
                                  }
                                  console.log(payload)
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

          </ScrollView>

        
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
      label: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 8,
      },
      label1: {
        fontSize: 15,
        fontWeight: 'bold',
        margin: 8,
      },

      questionaireContainer : {
        marginTop: 30,
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 10,
        shadowOffset: {width: 0, height: 1},
        shadowRadius: 2,
        elevation: 2,
        shadowOpacity: 0.4,
    } ,

    customInputBox:{

      width: '90%'
    },

    inputContainer : {
        marginTop: 30,
        width: '90%',
        //alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 120,
        borderRadius: 20,
        padding: 0,
        shadowOffset: {width: 0, height: 1},
        shadowRadius: 2,
        elevation: 2,
        shadowOpacity: 0.4,

    } ,

    input:{
        alignItems: 'center',
        width: '80%',
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
        marginTop: 20,
      },
      checkbox: {
        margin: 8,
      },

      relationContainer : {
        flexDirection: 'row',
        marginVertical: 30,    
        paddingHorizontal: 5,
        alignItems: 'center',
        width: '95%',
        zIndex: 200,
      },
})