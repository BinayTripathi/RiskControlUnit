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
            "package": "com.binaytripathi.icheckify"
          },
          extra: {
            baseURL : 'https://icheckify.azurewebsites.net/api'
          }
      };
    } else {
      return {
        "name": "icheckifyIChck",
        "android": {
            "adaptiveIcon": {
              "foregroundImage": "./assets/icheckifyIcon.png",
              "backgroundColor": "#ffffff"
            },
            "permissions": [
              "android.permission.CAMERA"
            ],
            "package": "com.binaytripathi.icheckifyIChck"
          },
          extra: {
            baseURL : 'https://chek.azurewebsites.net/api'
          }
      };
    }
  };
  