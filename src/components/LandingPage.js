import React from "react";
import LandingBackground from "../Images/AdvancedLandingPageDesign.jpg"
import '../style/LandingPage.css'
const LandingPage = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <>
      <img id="LandingIcon" src={LandingBackground} alt="Icon"></img>
      {/* <button onClick={setIsLoggedIn(true)}>sign in </button> */}
      
      
    </>
  );
};

export default LandingPage;
