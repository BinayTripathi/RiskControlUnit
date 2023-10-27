import { Camera } from "expo-camera";

export const LOGIN_ERROR_MESSAGE = "Invalid username or password"

export const DEFAULT_NO_NETWORK_MESSAGE = "Please check your network connection"
export const CASE_DETAILS_OFFLINE_ERROR_MESSAGE = DEFAULT_NO_NETWORK_MESSAGE

export const DOC_TYPE = {

    BENEFICIARY_PHOTO : 'BENIFICIARY-PHOTO',
    OCR : 'OCR' ,

    PHOTO_ID_SCANNER : {
        FACE_READER : {
            name : 'faceReader',
            cameraType : Camera.Constants.Type.back,
            faceCount: 1,
            type: 'PHOTO'
        } ,
        DUAL_FACE_READER: {
            name : 'dualFaceReader',
            cameraType : Camera.Constants.Type.front,
            faceCount: 2,
            type: 'PHOTO'
        },
        HOUSE: {
            name : 'house',
            cameraType : Camera.Constants.Type.back,
            faceCount: 1,
            type: 'PHOTO'
        },
        OTHERS:  {
            name : 'others',
            cameraType : Camera.Constants.Type.back,
            faceCount: 0,
            type: 'PHOTO'
        }
    },
    DOCUMENT_SCANNER : {
        PAN : {
            name : 'PAN',
            cameraType : Camera.Constants.Type.back,
            faceCount: 1,
            type: 'DOCUMENT'
        } ,
        ADHAR: {
            name : 'ADHAR',
            cameraType : Camera.Constants.Type.back,
            faceCount: 1,
            type: 'DOCUMENT'
        },
        PASSPORT: {
            name : 'PASSPORT',
            cameraType : Camera.Constants.Type.back,
            faceCount: 1,
            type: 'DOCUMENT'
        },
        DRIVING_LICENCE:  {
            name : 'DRIVING_LICENCE',
            cameraType : Camera.Constants.Type.back,
            faceCount: 1,
            type: 'DOCUMENT'
        },
        OTHERS:  {
            name : 'others',
            cameraType : Camera.Constants.Type.back,
            faceCount: 0,
            type: 'DOCUMENT'
        }
    }

}

export const SCREENS = {
    Home: "Home",
    Login : "Login",
    CaseList: "CaseList",
    CaseDetailsScreen: "CaseDetailsScreen",
    ImageCaptureScreen: "ImageCaptureScreen"
}

export const SESSION_TTL_IN_SEC = {
    USER_SESSION : 1000*3000,  // 300 sec
    CASE_LIST : 1000 * 60 * 50,  // 5 mins
    CASE_DETAILS: 1000 * 60 * 5
}
