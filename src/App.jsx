import React, { useEffect } from "react";

import Login from "./Login";
import Chats from "./Chats.jsx";
import { useStateValue } from "./Context";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import {toast} from 'react-hot-toast'
const App = () => {
  const { user } = useStateValue();
  const { setUser } = useStateValue();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const authUserCredentials = {
          name: user.displayName.toUpperCase(),
          pic: user.photoURL,
        };

        setUser(authUserCredentials);
        toast.success('Login successful')
      } else {
        setUser("");
       
      
      }
    });
    return () => unsubscribe();
  }, []);

  return <div>{!user ? <Login /> : <Chats />}</div>;
};

export default App;
// const authUserCredentials = {
//   name: result.user.displayName.toUpperCase(),
//   pic: result.user.photoURL,
// };

// setUser(authUserCredentials);
// localStorage.setItem(
//   "googleauthuser",
//   JSON.stringify(authUserCredentials)
// );
