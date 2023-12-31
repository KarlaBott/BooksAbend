import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import TreeIcon from "../Images/TreeIcon.png";
import { signup } from "../axios-services/users";
import "../style/Login_Signup.css";

const Signup = ({ isLoggedIn, setIsLoggedIn }) => {
  const [Password, setPassword] = useState("");
  const [Username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  let history = useHistory();

  useEffect(() => {}, [isLoggedIn]);

  async function HandleForm(event) {
    event.preventDefault();
    let response = await signup(Username, Password, email);
    let curUserid = sessionStorage.getItem("BWUSERID");
    // console.log("Signup > BWUSERID:", curUserid);
    if (parseInt(curUserid) > 1) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setMessage(response.message);
    if (response.user) history.push("/products");
  }

  return (
    <form id="Signup" onSubmit={HandleForm}>
      <label className="LoginLabel">Sign Up</label>
      <input
        autoComplete="username"
        value={Username}
        autoFocus
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        type="text"
        placeholder="Username"
        className="LoginInput"
      ></input>
      <input
        autoComplete="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        type="email"
        placeholder="Email"
        className="LoginInput"
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
      ></input>
      <p id="SignupError">{message}</p>
      <button id="SignupButton" type="submit">
        Register New Account
      </button>
      <img id="LoginIcon" src={TreeIcon} alt="Icon"></img>
      {!isLoggedIn ? (
        <div className="startShopping">
          Need An Account?
          <Link style={{ fontWeight: 800 }} to="/login">
            {"   "}LOGIN
          </Link>
        </div>
      ) : (
        <div className="startShopping">
          <Link to="/products">Start Shopping!</Link>
        </div>
      )}
    </form>
  );
};

export default Signup;
