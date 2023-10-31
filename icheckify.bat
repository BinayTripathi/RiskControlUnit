set MY_ENVIRONMENT=production
rmdir /s /q android
call npx expo prebuild --clean
cd ./android
call ./gradlew assembleRelease
call aws s3 cp .\app\build\outputs\apk\release\app-release.apk s3://apkichck/icheckify/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers full=emailaddress=ajeetkumar@email.com
echo "https://apkichck.s3.ap-southeast-2.amazonaws.com/icheckify/app-release.apk"
echo "Click any button to close"
pause