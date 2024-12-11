rmdir /s /q node_modules
rmdir /s /q android
expo install
npx expo prebuild --clean --no-install --platform android
xcopy "build.gradle" ".\android\build.gradle" /Y
xcopy "icheckify-upload-key.keystore" ".\android" /Y
npm run android

set EXPO_PUBLIC_GOOGLE_MAP_API_KEY=aizaSyAmfJSJM1Ej913jydNhTfDtMQMtng7FXTm

cd android
gradlew bundleRelease 
//npx react-native build-android --mode=release
gradlew assembleRelease

aws s3 cp .\app\build\outputs\apk\release\app-release.apk s3://ickeckify-apk/demo/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers full=id=e87d51ba1b7f28ae787f92bbc5d72972d8f39dc9dd3a037e172d2b1dc1f8c466
https://ickeckify-apk.s3.ap-southeast-2.amazonaws.com/demo/app-release.apk