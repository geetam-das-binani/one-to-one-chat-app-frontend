
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC6E3ws0UMqf_m2gk6GleW7_tFd0aWFvoI",
  authDomain: "wechat-afee6.firebaseapp.com",
  projectId: "wechat-afee6",
  storageBucket: "wechat-afee6.appspot.com",
  messagingSenderId: "827118959487",
  appId: "1:827118959487:web:95bfecc4f02b370a25f84a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export const auth=getAuth(app)
