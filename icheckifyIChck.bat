set MY_ENVIRONMENT=iChck
set CUR_YYYY=%date:~10,4%
set CUR_MM=%date:~4,2%
set CUR_DD=%date:~7,2%
set CUR_HH=%time:~0,2%
if %CUR_HH% lss 10 (set CUR_HH=0%time:~1,1%) 
set CUR_NN=%time:~3,2%
set CUR_SS=%time:~6,2%
set CUR_MS=%time:~9,2%
set SUBFILENAME=%CUR_YYYY%%CUR_MM%%CUR_DD%-%CUR_HH%%CUR_NN%%CUR_SS%
echo APK file : .\app\build\outputs\apk\release\app-release_%SUBFILENAME%.apk

set /P id=Enter GOOGLE API KEY: 
set EXPO_PUBLIC_GOOGLE_MAP_API_KEY=%id%
ECHO ..%EXPO_PUBLIC_GOOGLE_MAP_API_KEY%

rmdir /s /q android
call expo install
call npx expo prebuild --clean --no-install --platform android
cd ./android
call ./gradlew -stop
call ./gradlew assembleRelease
call ren .\app\build\outputs\apk\release\app-release.apk app-release_%SUBFILENAME%_dev.apk
call aws s3 cp .\app\build\outputs\apk\release\app-release_%SUBFILENAME%_dev.apk s3://apkichck/ichck/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers full=emailaddress=ajeetkumar@email.com
echo https://apkichck.s3.ap-southeast-2.amazonaws.com/ichck/app-release_%SUBFILENAME%_dev.apk
echo "Click any button to close"
pause