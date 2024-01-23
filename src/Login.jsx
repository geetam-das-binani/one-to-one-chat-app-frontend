import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import "./Login.css";
// import { useStateValue } from "./Context";
const Login = () => {
  // const { setUser } = useStateValue();

  const signIn = () => {
    signInWithPopup(auth, provider).then((_) => {});
  };
  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://cdn.pixabay.com/photo/2017/12/06/04/57/whatsapp-3000966_640.png"
          alt="chat-logo"
        />
        <div className="login__text">
          <h1>Sign in to WeChat</h1>
        </div>

        <div id="gSignInWrapper">
          <span className="label">Sign in with:</span>
          <div onClick={signIn} id="customBtn" className="customGPlusSignIn">
            <span className="icon">
              <img
                src="https://t4.ftcdn.net/jpg/03/08/54/37/240_F_308543787_DmPo1IELtKY9hG8E8GlW8KHEsRC7JiDN.jpg"
                alt="google logo"
              />
            </span>
            <span className="buttonText">Google</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
