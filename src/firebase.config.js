import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvkgzxF0oFmXobFPaiwYL_p6fxasl2QfU",
  authDomain: "cravebite-food.firebaseapp.com",
  databaseURL: "https://cravebite-food-default-rtdb.firebaseio.com",
  projectId: "cravebite-food",
  storageBucket: "cravebite-food.appspot.com",
  messagingSenderId: "415694520104",
  appId: "1:415694520104:web:6cb9bcbb034add2a375a1d",
  measurementId: "G-7BPJJGCMEY",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firestore = getFirestore(app);

const storage = getStorage(app);

export { app, firestore, storage };
