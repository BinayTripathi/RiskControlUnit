rmdir /s /q node_modules
rmdir /s /q android
expo install
npx expo prebuild --clean --no-install --platform android
xcopy "build.gradle" ".\android\build.gradle" /Y
xcopy "icheckify-upload-key.keystore" ".\android" /Y
npm run android

set EXPO_PUBLIC_GOOGLE_MAP_API_KEY=aizaSyAmfJSJM1Ej913jydNhTfDtMQMtng7FXtm

cd android
gradlew bundleRelease 
//npx react-native build-android --mode=release
gradlew assembleRelease

call aws s3 cp .\app\build\outputs\apk\release\app-release.apk s3://apkichck/icheckify/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers full=emailaddress=ajeetkumar@email.com
https://apkichck.s3.ap-southeast-2.amazonaws.com/icheckify/app-release.apk