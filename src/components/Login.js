import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import TreeIcon from "../Images/TreeIcon.png";
import { login } from "../axios-services/users";
import "../style/Login_Signup.css";

function Login({ isLoggedIn, setIsLoggedIn }) {
  const [Password, setPassword] = useState("");
  const [Username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {}, [isLoggedIn]);

  async function HandleForm(event) {
    event.preventDefault();
    let response = await login(Username, Password);
    let curUserid = sessionStorage.getItem("BWUSERID");
    console.log("Login > BWUSERID:", curUserid);
    if (parseInt(curUserid) > 1) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setMessage(response.message);
    // <Redirect to="/products" />;
  }

  return (
    <form id="Login" onSubmit={HandleForm}>
      <label className="LoginLabel">Login</label>
      <input
        autoComplete="username"
        value={Username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        type="text"
        placeholder="Username"
        className="LoginInput"
        id="Username"
      ></input>
      <input
        autoComplete="current-password"
        value={Password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        type="password"
        placeholder="Password"
        className="LoginInput"
        id="Password"
      ></input>
      <p id="LoginError">{message}</p>
      <button id="LoginButton" type="submit">
        Sign in
      </button>
      <img id="LoginIcon" src={TreeIcon} alt="Icon"></img>
      {!isLoggedIn ? (
        <div className="startShopping">
          Need An Account?{"  "}
          <Link to="/signup">REGISTER!</Link>
        </div>
      ) : (
        <div className="startShopping">
          <Link to="/products">Start Shopping!</Link>
        </div>
      )}
    </form>
  );
}

export default Login;
