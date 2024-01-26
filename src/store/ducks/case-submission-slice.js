import {createAction, createSlice} from '@reduxjs/toolkit';
import {call, put, select} from 'redux-saga/effects';
import {updateCaseDocument, updateCaseFace, submitCase, addVideo} from '@services/RestServiceCalls'
import types from '../types';

import { deleteCaseFromListAfterSubmission } from './cases-slice'
import { deleteCaseDetailsAfterSubmission } from './case-details-slice'
import { UPLOAD_TYPE, UPLOAD_SUCCESS_INDICATOR } from '@core/constants';


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


export const requestAddAudioAction = createAction(
  types.REQUEST_ADD_AUDIO,
  function prepare({claimId, audioDetails}) {
    return {
      payload: {
        claimId,
        audioDetails
      },
      meta: {
        retry: true
      }
    };
  },
);

export const requestAddVideoAction = createAction(
  types.REQUEST_ADD_VIDEO,
  function prepare({claimId, videoDetails}) {
    return {
      payload: {
        claimId,
        videoDetails 
      },
      meta: {
        retry: true
      }
    };
  },
);


export const requestSaveFormAction = createAction(
  types.REQUEST_SAVE_FORM,
  function prepare({claimId, formData }) {
    return {
      payload: {
        claimId,         
        formData  
      },
    };
  },
);


export const requestSubmitCaseAction = createAction(
  types.REQUEST_SUBMIT_CASE,
  function prepare({claimId, email, beneficiaryId, Remarks, Question1, Question2, Question3, Question4 }) {
    return {
      payload: {
        claimId, 
        email,
        beneficiaryId,
        Remarks ,
        Question1,
        Question2,
        Question3,
        Question4  
      },
    };
  },
);


const initialState = {
    casesUpdates: {},  // Stores case details for all. This needs to be cleared on Submit    
    loading: false,
    error: false,

    loadingAudio: false,
    errorAudio: false,
    loadingVideo: false,
    errorVideo: false
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
              
              // {caseID : 
              //    {capability1: update}
              //     capability2: update} }  Only one update per capability, we can enable more if we want with array of updates
              let thisUpdate = {
                [updateDetails.capability] : updateDetails
              }
              if(claimId in state.casesUpdates) {           
               state.casesUpdates[claimId][updateDetails.capability] = updateDetails
              } else {                    
                state.casesUpdates[claimId] = thisUpdate   
              }
          },
          failureUpdateCase: (state, action) => {
            state.loading = false;
            state.error = action.payload
          },


          requestAddAudio: (state, action) => {
            state.loadingAudio = false
            state.errorAudio = false
          },

          successAddAudio : (state,action) => {  // Listens to saveFormAction
                          
            state.loadingAudio = true
            let claimId = action.payload.claimId;
            let audioDetails = action.payload.audioDetails
            delete audioDetails.uri

            let thisUpdate = {
              [audioDetails.capability] : audioDetails // This will contain unique id as well for each audio. For now we assume only one audio and hence id will not be of any use. But if we want many audios then id to be used to identify each audio. Same with video
            }
            if(claimId in state.casesUpdates) {           
              state.casesUpdates[claimId][audioDetails.capability] = audioDetails
            } else {                    
              state.casesUpdates[claimId] = thisUpdate   
            }
            console.log(claimId)
          },

          failureAddAudio: (state, action) => {
            state.loadingAudio = false
            state.errorAudio = true
          },
          requestAddVideo: (state, action) => {
            state.loadingVideo = false
            state.errorVideo = false
          },

          successAddVideo : (state,action) => {  // Listens to saveFormAction
                          
            state.loadingVideo = true
            let claimId = action.payload.claimId;
            let videoDetails = action.payload.videoDetails
            delete videoDetails.uri

            let thisUpdate = {
              [videoDetails.capability] : videoDetails // This will contain unique id as well for each audio. For now we assume only one audio and hence id will not be of any use. But if we want many audios then id to be used to identify each audio. Same with video
            }
            if(claimId in state.casesUpdates) {           
              state.casesUpdates[claimId][videoDetails.capability] = videoDetails
            } else {                    
              state.casesUpdates[claimId] = thisUpdate   
            }
            console.log(claimId)
          },

          failureAddVideo: (state) => {
            state.loadingVideo = false
            state.errorVideo = true
          },

          requestSaveForm : (state,action) => {  // Listens to saveFormAction
                           
            let claimId = action.payload.claimId;
            let formData = action.payload.formData

            let thisUpdate = {
              [formData.capability] : formData
            }
            if(claimId in state.casesUpdates) {           
              state.casesUpdates[claimId][formData.capability] = formData
            } else {                    
              state.casesUpdates[claimId] = thisUpdate   
            }
            console.log(claimId)
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


  // To process face and document photo
  export function* asyncPostCaseDocuments(action) {
   
    try {              
      //ToDo : Do not fetch if case details available within TTL
      //documentDetails : {PAN : {}}
      //As soon as the image is clicked - show that image is submited.       
      let successPayload = {
        [action.payload.claimId] : {...action.payload.documentDetails, 
              locationImage: '',
              OcrImage: '',
              id: action.payload.id }            
      }
      yield put(successUpdateCase(successPayload));  

      

        let readText = null
        //if(action.payload.documentDetails.docType ===  UPLOAD_TYPE.DOCUMENT)
        //  readText = yield call(callGoogleVisionAsync,action.payload.documentDetails.OcrImage)

        let postUpdatePayload = action.payload.documentDetails
        postUpdatePayload.OcrData = readText?.text

        let response = ''
        if (action.payload.documentDetails.docType ===  UPLOAD_TYPE.DOCUMENT)
          response = yield call(updateCaseDocument,postUpdatePayload);    
        else
          response = yield call(updateCaseFace,postUpdatePayload);    
        const responseUserData = response.data        
        console.log("received claim details")
        
        //ToDo :  Handle when there is error calling the one of the 2 APIs
        if (responseUserData) {                      
            let successPayload = {
              [action.payload.claimId] : {...action.payload.documentDetails, 
                    locationImage: action.payload.documentDetails.docType ===  UPLOAD_TYPE.PHOTO ? responseUserData.locationImage:'', 
                    OcrImage: action.payload.documentDetails.docType ===  UPLOAD_TYPE.DOCUMENT ? responseUserData.ocrImage: '', 
                    id: action.payload.id,
                    facePercent: responseUserData.facePercent,
                    panValid: responseUserData.panValid }
            }

          yield put(successUpdateCase(successPayload)); 
        } else {    // TODO  :  retry on error
          yield put(failureUpdateCase());
        }
        return;
      } catch (err) {
          console.log(err);
          yield put(failureUpdateCase(err));
      }
  }


  //To process audio and video
  export function* asyncPostCaseAudio(action) {

  }

  export function* asyncPostCaseVideo(action) {

    try{
      console.log('asyncPostCaseVideo')
      let response = yield call(addVideo,action.payload.claimId, action.payload.videoDetails);
      const responseUserData = response.data        
      if (responseUserData) 
        yield put(successAddVideo(action.payload))
      else
        yield put(failureAddVideo())

    } catch (err) {
      yield put(failureAddVideo());
    }   

  }

  export function* asyncSubmitCaseDocuments(action) {
    try {              
      //ToDo : Do not fetch if case details available within TTL
      //documentDetails : {PAN : {}}
        const response = yield call(submitCase,action.payload);    
        const responseUserData = response.data        
        if (responseUserData) {   
          yield put(deleteCaseFromListAfterSubmission(action.payload.claimId))
          yield put(successDeleteCaseUpdateDetailsAfterSubmission(action.payload.claimId));   
          yield put(deleteCaseDetailsAfterSubmission(action.payload.claimId)) 
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
    successDeleteCaseUpdateDetailsAfterSubmission, failureSubmitCase, successAddVideo, failureAddVideo} = casesUpdateSlice.actions;

export default casesUpdateSlice.reducer