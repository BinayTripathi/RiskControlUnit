import Constanst from 'expo-constants'
import * as Request from '../helpers/serviceApi'

//const BASE_URL = 'https://rcu.azurewebsites.net/api';
//const BASE_URL = 'https://ccutest.free.beeceptor.com'
//const BASE_URL = 'https://holosync.azurewebsites.net/api'

//let  BASE_URL =  'https://icheckify.azurewebsites.net/api'
//const BASE_URL =  'https://chek.azurewebsites.net/api'
const BASE_URL = "https://chek.azurewebsites.net/api"
//Constanst?.expoConfig?.extra?.baseURL


const verifyLogin =  async (emailId) => {
 
   
    const url = `https://my-json-server.typicode.com/BinayTripathi/demo/authenticate`   
    console.log(url) 
    let resp = await Request.get({url});
  
    

}

export const userLogin = async (emailId) => {
  try {
    
   
      const url = `${BASE_URL}/agent/agent?email=${emailId}`
      console.log(url)
      let response = await Request.get({url});
      return response
   
  } catch (error) {
    console.log(JSON.stringify(error.message)); // this is the main part. Use the response property from the error object
    throw JSON.stringify(error);
  }
}

export const getAllCases = async (email) => {

  try {
    //const url = `https://my-json-server.typicode.com/BinayTripathi/demo/CASE_LIST`
    const url = `${BASE_URL}/agent/agent?email=${email}`
    //const url = 'https://ccutest.free.beeceptor.com/agents'
    //const url = 'https://rcu.azurewebsites.net/api/agent/agent?email=agent@agency1.com'
    console.log(url)
    let response = await Request.get({url});
    return response
  } catch (error) {
    console.log(JSON.stringify(error.message)); // this is the main part. Use the response property from the error object
    throw JSON.stringify(error.message);
  }
}


export const getAllCaseCoordinates = async (email) => {

  try {
    const url = `${BASE_URL}/agent/agent-map?email=${email}`
    console.log(url)
    let response = await Request.get({url});
    return response
  } catch (error) {
    console.log(JSON.stringify(error.message)); // this is the main part. Use the response property from the error object
    throw JSON.stringify(error.message);
  }
}

export const getCaseDetails = async (email, claim) => {
  try {
  const url = `${BASE_URL}/agent/get?email=${email}&claimid=${claim}`
  //const url = 'https://rcu.azurewebsites.net/api/agent/get?email=agent@agency1.com&claimid=1da83e41-12e5-4827-87c1-0d7a0fc7ab38'
  //const url = 'https://ccutest.free.beeceptor.com/details'
  console.log(url)
  let response = await  Request.get({url}); 
  return response
  }  catch (error) {
    console.log(JSON.stringify(error.message)); // this is the main part. Use the response property from the error object
    throw JSON.stringify(error.message);
  }
}





export const updateCase = async (body) => {
  console.log('Update case API being called')
  //console.log(body)
  try {
      const url = `${BASE_URL}/agent/post`;
      //const url = `https://ccutest.free.beeceptor.com/update`
      const config = {}
      const data = {
        ...body
      };
      let response = await  Request.post({url, config, data});
      return response
    }  catch (error) {
      console.log(JSON.stringify(error.message)); // this is the main part. Use the response property from the error object
      throw JSON.stringify(error.message);
    }
  };

  export const submitCase = async (body) => {
    console.log(JSON.stringify(body))
    try {
        const url = `${BASE_URL}/agent/submit`;
        //const url = `https://my-json-server.typicode.com/BinayTripathi/demo/authenticate`  
        const config = {}
        const data = {
          ...body
        };
        console.log(url)
        
        let response = await  Request.post({url, config, data});
        return response
      }  catch (error) {
        console.log(JSON.stringify(error.message)); // this is the main part. Use the response property from the error object
        throw JSON.stringify(error.message);
      }
    };
  