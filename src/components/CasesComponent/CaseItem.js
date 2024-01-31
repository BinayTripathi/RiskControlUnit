import React from "react";
import { Pressable, StyleSheet, Text, View, Image} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { theme } from '@core/theme';
//import { selectCase } from "@store/ducks/case-slice";

const TEXT_LENGTH = 80
const TEXT_HEIGHT = 20
const OFFSET = TEXT_LENGTH / 2 - TEXT_HEIGHT / 2
//Above is based on https://medium.com/@therealmaarten/how-to-layout-rotated-text-in-react-native-6d55b7d71ca5

function CaseItem({ caseDetails }) {

  let dispatch = useDispatch();
  const navigation = useNavigation()

  const caseType =  caseDetails.claimType && caseDetails.claimType != "Death" ? 
  ( <View style={styles.caseTypeHealthContainer}>
        <View style={{ width: TEXT_HEIGHT, height: TEXT_LENGTH   }}>
            <Text style={styles.caseType}> HEALTH</Text>
        </View>
    </View>
  ) :
  ( <View style={styles.caseTypeDeathContainer}>
      <View style={{ width: TEXT_HEIGHT, height: TEXT_LENGTH }}>
          <Text style={styles.caseType}> DEATH</Text>
      </View>
    </View>
  )

  let clientPhoto = caseDetails?.customerPhoto?.replace('image/*;base64','image/png;base64')
  return (
    <Pressable onPress={()=> {
      
      //dispatch(selectCase({...caseDetails}))
      
      navigation.navigate('CaseDetailsScreen', {
        claimId : caseDetails.claimId
      }
      )}}> 
      <View style={styles.caseItemContainer}> 

          {caseType}

          <View style={styles.caseItem}>
            <View style={styles.caseItemLeft}>
              <Text style={[styles.textBase, styles.name]}>{caseDetails.customerName}</Text>
              <Text style={[styles.textBase, styles.district]}>{caseDetails.district}</Text>

              <View style={{paddingTop: 10, borderTopColor: theme.colors.borderSeperator, borderTopWidth: 1}}>
                <Text style={[styles.textBase, styles.description]}>Policy Number</Text> 
                <Text style={[styles.textBase]}>{caseDetails.policyNumber}</Text>  
              </View>                      
            </View>

            <View style={styles.caseItemRight}>
              <View style = {styles.profilePhotoContainer} >
                  <Image style = {{width: 40, height: 40, borderRadius: 20}} source = {{uri:`${clientPhoto}`}}/>
              </View>
              <View style={styles.dueByContainer}>
                <Text style={styles.dueBy}>Code</Text>
                <Text style={styles.dueBy}>{caseDetails.code}</Text>
              </View>
            </View>
          
          </View>
      </View> 
      
    </Pressable>
  );
}

export default CaseItem;

const styles = StyleSheet.create({
  caseItemContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center'
  },
  caseTypeHealthContainer: {
    width: 30,
    padding: 5,
    height: '100%',
    backgroundColor:  theme.colors.title2Color,
    borderTopLeftRadius : 8,
    borderBottomLeftRadius : 8,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    
  },
  caseTypeDeathContainer: {
    width: 30,
    padding: 5,
    height: '100%',
    backgroundColor: theme.colors.title1Color,
    borderTopLeftRadius : 8,
    borderBottomLeftRadius : 8,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  caseType : {
    transform: [{ rotate: '270deg' }, { translateX: -OFFSET }, 
    { translateY: -OFFSET }],
    width: TEXT_LENGTH,
    height: TEXT_HEIGHT,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  caseItem: {
    padding: 12,
    //backgroundColor: theme.colors.caseItemBackground,
    backgroundColor: theme.colors.details_card_color,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopRightRadius : 8,
    borderBottomRightRadius : 25,
    elevation: 8,
    shadowColor: theme.colors.shadow,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
  },
  caseItemLeft: {
    width : '60%'
  },

  caseItemRight: {
    alignContent: 'center'
  },
  textBase: {
    //color: theme.colors.text,
    color: 'white'
  },
  name: {
    fontSize: 22,
    marginBottom: 4,
    width: 160,
    maxWidth: 180,
    fontWeight: 'bold',
    flexWrap: 'wrap'
  },
  district: {
   
   
  },
  description: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  profilePhotoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#93be6e',
    borderWidth: 2,
    shadowColor: "black",  
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation:8,
    margin: 10
  },
  dueByContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    minWidth: 80
  },
  dueBy: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
});