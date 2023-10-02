import { createSlice } from "@reduxjs/toolkit"

import {call, put} from 'redux-saga/effects';

import {userLogin} from '@services/RestServiceCalls'
import {reset} from '@services/NavigationService';
import { LOGIN_ERROR_MESSAGE } from '@core/constants'
import { SCREENS } from '@core/constants';

const initialState = {
    data: {},
    error: null,
    loading: false,
    userId: null,
    auth: null,
    lastLogin: null,
    isLoggedIn : false
  };



  /*
export const requestValidateUser = createAction(TYPES.REQUEST_VALIDATE_USER);
export const successValidateUser = createAction(TYPES.SUCCESS_VALIDATE_USER);
export const failureValidateUser = createAction(TYPES.FAILURE_VALIDATE_USER);
export const logoutUser = createAction(TYPES.LOGOUT_USER);


  const validateUserReducers = {
    [TYPES.REQUEST_VALIDATE_USER]: (state) => {
      state.loading = true;      
    },
    [TYPES.SUCCESS_VALIDATE_USER]: (state, action) => {
      state.loading = false;
      state.userid = action.payload.emailId,
      state.auth = action.payload.pwd
      state.isLoggedIn = true
      state.lastLogin = (new Date()).getTime() / 1000
      state.data = {'claim': action.payload.data} ;
      
    },
    [TYPES.FAILURE_VALIDATE_USER]: (state) => {
      state.loading = false;
      state.data = {};
      state.userid = null,
      state.auth = null,
      state.isLoggedIn = false
    },
  };
  
  const logoutUserReducers = {
    [TYPES.LOGOUT_USER]: (state) => {     
        state.isLoggedIn = false
    },
  };

  export default createReducer(INITIAL_STATE, {
    ...validateUserReducers,
    ...logoutUserReducers,
  });*/

  const userSlice = createSlice({
    name: "user",
    initialState :  {      
        //data: {},
        error: null,
        loading: false,
        userId: null,
        auth: null,
        lastLogin: null,
        isLoggedIn : false
     
    },
    reducers:{
          requestValidateUser: (state) => {
              state.loading = true;     
              state.error = null        
          },
          requestValidateUserAuto:  (state) => {
            state.loading = true;  
          },
          successValidateUser: (state, action) => {            
            state.loading = false;
            state.userId = action.payload.emailId,
            state.auth = action.payload.password
            state.isLoggedIn = true
            state.lastLogin =  (new Date()).toISOString()
            //state.data = {'claim': action.payload.data} ;            
          },

          failureValidateUser: (state) => {
            //state.data = {};
            state.loading = false;            
            state.userId = null,
            state.auth = null,
            state.isLoggedIn = false
            state.error = LOGIN_ERROR_MESSAGE
          },
                
          navigateFromHomePage :  (state) => {
            console.log('navigate from home page')
            state.loading = false; 
            state.error = null      
          },

          logoutUser: (state) => {     
            state.data = {};
            state.error = null,
            state.loading = false,            
            isLoggedIn = false,
            state.isLoggedIn = true
            state.lastLogin =  null
        }
    }
  })

  export function* asyncRequestValidateUser(action) {
    try {      
        const response = yield call(userLogin, action.payload.emailId);
        //const responseUserData = response.data?.token;     
        const responseUserData = response.data
        if (responseUserData) {          
          yield put(successValidateUser({...action.payload, data: responseUserData }));
          return reset({routes: [{name: SCREENS.CaseList}]});
        }      
      yield put(failureValidateUser());
    } catch (err) {
      console.log(err);
      yield put(failureValidateUser());
    }
  }

  export function* asyncRequestValidateUserAutologin(action) {  
    yield put(successValidateUser({...action.payload}))
    return   
  }

  export const { requestValidateUser, requestValidateUserAuto, successValidateUser, 
    failureValidateUser, navigateFromHomePage, logoutUser } = userSlice.actions;
  export default userSlice.reducer