import { Platform } from 'react-native';

// Firebase JS SDK (works with Expo and all platforms)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configurations for different platforms
const firebaseConfig = {
  // Web configuration
  web: {
    apiKey: "AIzaSyAvYnj-PfYLqI-HA7pl5eMA1-aaI1fCJXc",
    authDomain: "sheetflow-app.firebaseapp.com",
    projectId: "sheetflow-app",
    storageBucket: "sheetflow-app.firebasestorage.app",
    messagingSenderId: "79144339891",
    appId: "1:79144339891:web:c30895d5f03becec8a63c6"
  },
  // iOS configuration
  ios: {
    apiKey: "AIzaSyBTCpKEL_UYjOR6QLO_qlVL4NvkKzwsoxE",
    authDomain: "sheetflow-app.firebaseapp.com",
    projectId: "sheetflow-app",
    storageBucket: "sheetflow-app.firebasestorage.app",
    messagingSenderId: "79144339891",
    appId: "1:79144339891:ios:cae433c08a33c2268a63c6"
  },
  // Android configuration
  android: {
    apiKey: "AIzaSyDUoZMafdwGuL5LLmq--jNjU3ppH18E3Js",
    authDomain: "sheetflow-app.firebaseapp.com",
    projectId: "sheetflow-app",
    storageBucket: "sheetflow-app.firebasestorage.app",
    messagingSenderId: "79144339891",
    appId: "1:79144339891:android:ef3f67e3e0b5cf038a63c6"
  }
};

// Get platform-specific config
const getCurrentPlatformConfig = () => {
  switch (Platform.OS) {
    case 'ios':
      return firebaseConfig.ios;
    case 'android':
      return firebaseConfig.android;
    case 'web':
      return firebaseConfig.web;
    default:
      return firebaseConfig.web; // Fallback to web config
  }
};

// Initialize Firebase
const app = initializeApp(getCurrentPlatformConfig());

// Initialize Auth
const auth = getAuth(app);

export { auth };
export default app;
