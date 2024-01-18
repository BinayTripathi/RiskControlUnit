npx expo prebuild --clean --no-install --platform android
xcopy "build.gradle" ".\android\build.gradle" /Y
npm run android