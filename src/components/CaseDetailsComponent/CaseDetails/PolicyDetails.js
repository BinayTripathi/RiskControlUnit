import { StyleSheet, View, Text, Image,  Dimensions} from 'react-native';

import { Surface } from 'react-native-paper';


import Card from '@components/UI/Card';

import { theme } from '@core/theme';
import { Padder } from '@components//UI/Wrapper';


const { width, height } = Dimensions.get('window');
export default PolicyDetailsComponent = ({selectedClaim}) => {  

     
    if(selectedClaim === undefined)
      return null;

    let policy = selectedClaim.policy
    if(policy === undefined)
      return null;

    console.log(policy)
  
      return (            
        
         <Padder>
          <View  style={styles.container} >   

            <View style={{paddingLeft: 10, marginTop: 10}}> 
                <Text style = {[styles.textBase, styles.description ]}>POLICY DETAILS</Text>
            </View>
         

              <View style =  {styles.detailsCardContainer}>      

              <Card style = {styles.card}>     

                <View style= {styles.detailsContainer}>                          
                    <Text style = {[styles.textBase , styles.label]}>Policy Number</Text>                 
                    <Text style = {[styles.textBase , styles.personDetail]}>{policy.policyNumber}</Text>                   
                  </View>
                <View style= {[styles.detailsContainer,  styles.seperator]}>                          
                    <Text style = {[styles.textBase , styles.label]}>Claim Type</Text>                 
                    <Text style = {[styles.textBase , styles.personDetail]}>{policy.claimType}</Text>                   
                  </View>

                  <View style= {styles.detailsContainer}>                          
                    <Text style = {[styles.textBase , styles.label ]}>Issue Date</Text>                 
                    <Text style = {[styles.textBase, styles.personDetail ]}>{policy.issueDate}</Text>                   
                  </View>

                  <View style= {[styles.detailsContainer,  styles.seperator]}>                          
                  <Text style = {[styles.textBase , styles.label ]}>Incident Date</Text>                 
                    <Text style = {[styles.textBase, styles.personDetail ]}>{policy.incidentDate}</Text>                
                  </View>

                  <View style= {[styles.detailsContainer]}>                          
                    <Text style = {[styles.textBase , styles.label]}>Reason</Text>                 
                    <View style={{paddingLeft: 20,  flexShrink: 1}}><Text style = {[styles.textBase , styles.personDetail]}>{policy.reason}</Text></View>                       
                  </View>   

                </Card>                            
                <Image source={require('@root/assets/PolicyDocument.png')} style={styles.image} /> 
                                     
               </View>  

               <View style =  {styles.detailsCardContainer}>
               <Card style = {[styles.card,{backgroundColor: '#c3bfbf'}]}>

                <Surface style={{height: 100, width: 100, borderRadius: 20, backgroundColor: '#0b0b0b'}}>

                </Surface>
               </Card> 
               
              </View>
                        
          </View>
          </Padder>       
       
   
          
              
              )
  }
  
  
  
  const styles = StyleSheet.create({
  
      container : {
         flex: 1,
         width: width,
         marginTop: 70,
      },  

      description: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#181818',
        fontSize: 28,
        fontWeight: 'bold',
        textShadowColor: 'rgba(22, 6, 96, 0.75)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 20,
      },
      ovalContainer : {            
         
      },
      oval: {        
          height: width,
          borderRadius: width/2,
          backgroundColor:'transparent',
          transform: [{ scaleX: 2 }],
      },   
      transformCompress : {
          transform: [{ scaleX: 1/2 }],
      },
  
      titleContainer : {
          padding: 10,
          marginTop: 70,  
     },
        image: {
          width: 80,
          height: 80,
          borderRadius: 80,  
          transform: [{ translateY: -30 }],
        },
        shadowContainer : {
          marginTop: 20,
          shadowOffset: { width: 1, height: 1 },
          shadowColor: '#333',
          shadowOpacity: 0.3,
          shadowRadius: 2,
          alignItems: 'center'
        },

        mainTitle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#181818'
        },

       detailsCardContainer : {      
        marginTop: 20,          
        alignContent: 'center',
        alignItems: 'center',   
    }, 

    card : { 
      alignItems: 'flex-start', 
      padding: 20, 
      width: '90%', 
      //backgroundColor: theme.colors.details_card_color
      backgroundColor:'#cccccc'
    },

    detailsContainer : {      
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      width: '100%',
      marginVertical: 3
  }, 

  detailsContainerColumn : {      
    
    alignItems: 'flex-start', 
    justifyContent: 'flex-start', 
    width: '100%',
    marginVertical: 3
}, 

  seperator: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSeperator,
  },

    textBase: {
        color: 'black',
      },
     
      
      label: {
        fontWeight: '400',
        fontSize: 16,
      },

      personDetail: {
        fontSize: 16,
        fontWeight: 'bold'
      },

})