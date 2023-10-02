import {createAction, createSlice} from '@reduxjs/toolkit';
import {call, put, select} from 'redux-saga/effects';
import {updateCase, submitCase} from '@services/RestServiceCalls'
import types from '../types';

import { deleteCaseFromListAfterSubmission } from './cases-slice'
import { deleteCaseDetailsAfterSubmission } from './case-details-slice'
import callGoogleVisionAsync from '../../helpers/OCRHelper'


// ACTIONS
export const requestUpdateBeneficiaryPhotoCaseAction = createAction(
  types.REQUEST_UPDATE_BENEFICIARY_PHOTO_CASE,
  function prepare({claimId, documentDetails, id}) {
    return {
      payload: {
        claimId,
        documentDetails,    
        id   
      },
      meta: {
        retry: true
      }
    };
  },
);

export const requestUpdatePanCaseAction = createAction(
  types.REQUEST_UPDATE_PAN_CASE,
  function prepare({claimId, documentDetails, id}) {
    return {
      payload: {
        claimId,
        documentDetails,    
        id   
      },
      meta: {
        retry: true
      }
    };
  },
);


export const requestSubmitCaseAction = createAction(
  types.REQUEST_SUBMIT_CASE,
  function prepare({claimId, email, beneficiaryId, Remarks }) {
    return {
      payload: {
        claimId, 
        email,
        beneficiaryId,
        Remarks    
      },
    };
  },
);


const initialState = {
    casesUpdates: {},  // Stores case details for all. This needs to be cleared on Submit    
    loading: false,
    error: false,
  }

  const casesUpdateSlice = createSlice({
    name: "casesUpdates",
    initialState,
    reducers:{ 
          requestUpdateBeneficiaryPhotoCase: (state) => {                  
            state.loading = true;     
            state.error = null        
          },      
          requestUpdatePanCase: (state) => {                  
            state.loading = true;     
            state.error = null        
          },
          successUpdateCase:  (state, action) => {     
              
              state.loading = false;                  
              let claimId = null;
              let updateDetails = null
              for (const [key, value] of Object.entries(action.payload)) {
               claimId = key
               updateDetails = value
              }
              
              if(claimId in state.casesUpdates) {

                let replaceIndex = state.casesUpdates[claimId].findIndex((eachClaim) =>   {                 
                  return updateDetails.docType === eachClaim.docType // Since this was made array with the intention that multiple clicks of same docType is possible. Disabling it for Demo
                })
                if ( replaceIndex === -1)
                  state.casesUpdates[claimId].push(updateDetails)
                else 
                  state.casesUpdates[claimId][replaceIndex] = updateDetails
              } else {                    
                state.casesUpdates[claimId] = [updateDetails]   
              }
          },
          failureUpdateCase: (state, action) => {
            state.loading = false;
            state.error = action.payload
          },

          requestSubmitCase :  (state) => {        
            state.loading = true;     
            state.error = null        
          },      
          successDeleteCaseUpdateDetailsAfterSubmission: (state,action) => {
            if (action.payload in state.casesUpdates)
              delete state.casesUpdates[action.payload]; 

            state.loading = false;     
            state.error = null 
          },
          failureSubmitCase : (state,action) => {
            state.loading = false;     
            state.error = action.error 
          }

    }
  })



  export function* asyncPostCaseDocuments(action) {
   
    try {              
      //ToDo : Do not fetch if case details available within TTL
      //documentDetails : {PAN : {}}
      let readText = null
      if(action.payload.documentDetails.docType !== 'BENIFICIARY-PHOTO')
        readText = yield call(callGoogleVisionAsync,action.payload.documentDetails.OcrImage)

        let postUpdatePayload = action.payload.documentDetails
        postUpdatePayload.OcrData = readText?.text

        const response = yield call(updateCase,postUpdatePayload);    
        const responseUserData = response.data        
        console.log("received claim details")
        if (responseUserData) {                      

            let successPayload = {
              [action.payload.claimId] : {...action.payload.documentDetails, 
                    locationImage: responseUserData.locationImage, 
                    OcrImage: responseUserData.ocrImage, 
                    id: action.payload.id }
            }

          yield put(successUpdateCase(successPayload));     
        } else {
          yield put(failureUpdateCase());
        }
        return;
      } catch (err) {
          console.log(err);
          yield put(failureUpdateCase(err));
      }
  }

  export function* asyncSubmitCaseDocuments(action) {
    try {              
      //ToDo : Do not fetch if case details available within TTL
      //documentDetails : {PAN : {}}
        const response = yield call(submitCase,action.payload);    
        const responseUserData = response.data        
        if (responseUserData) {   
          yield put(successDeleteCaseUpdateDetailsAfterSubmission(action.payload.claimId));   
          yield put(deleteCaseDetailsAfterSubmission(action.payload.claimId)) 
          yield put(deleteCaseFromListAfterSubmission(action.payload.claimId))
        } else {
          yield put(failureSubmitCase());
        }
        return;
      } catch (err) {
          console.log(err);
          yield put(failureSubmitCase(err));
      }
  }

  export function* asyncOfflineUpdateOrSubmitCase(action) {

    console.log('Update in offline mode')
    try {                    
        const {prevAction} = action.payload;
        if ( action.payload.prevAction.type === types.REQUEST_UPDATE_BENEFICIARY_PHOTO_CASE  || 
           action.payload.prevAction.type === types.REQUEST_UPDATE_PAN_CASE) {
          let successPayload = {
            [prevAction.payload.claimId] : {...prevAction.payload.documentDetails, locationImage: "", OcrImage: "",  id: prevAction.payload.id }
          }
          yield put(successUpdateCase(successPayload));    
        }      
        return;
      } catch (err) {
          console.log(err);
          yield put(failureSubmitCase(err));
      }
  }



  export const {   successUpdateCase,  failureUpdateCase,  
    successDeleteCaseUpdateDetailsAfterSubmission, failureSubmitCase} = casesUpdateSlice.actions;

export default casesUpdateSlice.reducer