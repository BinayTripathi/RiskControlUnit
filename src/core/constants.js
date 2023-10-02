export const LOGIN_ERROR_MESSAGE = "Invalid username or password"

export const DEFAULT_NO_NETWORK_MESSAGE = "Please check your network connection"
export const CASE_DETAILS_OFFLINE_ERROR_MESSAGE = DEFAULT_NO_NETWORK_MESSAGE

export const SCREENS = {
    Home: "Home",
    Login : "Login",
    CaseList: "CaseList",
    CaseDetailsScreen: "CaseDetailsScreen",
    ImageCaptureScreen: "ImageCaptureScreen"
}

export const SESSION_TTL_IN_SEC = {
    USER_SESSION : 1000*300,  // 30 sec
    CASE_LIST : 1000 * 60 * 50,  // 5 mins
    CASE_DETAILS: 1000 * 60 * 5
}