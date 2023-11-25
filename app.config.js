module.exports = () => {
    if (process.env.MY_ENVIRONMENT === 'production') {
      return {
        /* your production config */
        "name": "icheckify",
        "android": {
            "adaptiveIcon": {
              "foregroundImage": "./assets/icheckifyIcon.png",
              "backgroundColor": "#ffffff"
            },
            "permissions": [
              "android.permission.CAMERA"
            ],
            "package": "com.binaytripathi.icheckify",
            "config": {
              "googleMaps": {
                "apiKey": process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY
              }
            },
          },
          extra: {
            baseURL : 'https://icheckify.azurewebsites.net/api'
          }
      };
    } else {
      return {
        "name": "icheckifyDev",
        "android": {
            "adaptiveIcon": {
              "foregroundImage": "./assets/icheckifyIcon.png",
              "backgroundColor": "#ffffff"
            },
            "permissions": [
              "android.permission.CAMERA"
            ],
            "package": "com.binaytripathi.icheckifyDev",
            "config": {
              "googleMaps": {
                "apiKey": process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY
              }
            },
          },
          extra: {
            baseURL : 'https://chek.azurewebsites.net/api'
          },
      };
    }
  };
  