set MY_ENVIRONMENT=iChck
set /P id=Enter GOOGLE API KEY: 
set EXPO_PUBLIC_GOOGLE_MAP_API_KEY=%id%
ECHO ..%EXPO_PUBLIC_GOOGLE_MAP_API_KEY%
rmdir /s /q android
call npx expo prebuild --clean --no-install --platform android
cd ./android
call ./gradlew -stop
call ./gradlew assembleRelease
call aws s3 cp .\app\build\outputs\apk\release\app-release.apk s3://apkichck/ichck/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers full=emailaddress=ajeetkumar@email.com
echo "https://apkichck.s3.ap-southeast-2.amazonaws.com/ichck/app-release.apk"
echo "Click any button to close"
pause