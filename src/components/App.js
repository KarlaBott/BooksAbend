import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
// getAPIHealth is defined in our axios-services directory index.js
import { getAPIHealth } from "../axios-services";
import "../style/App.css";

import LandingPage from "./LandingPage";
import Nav from "./Nav";
import Login from "./Login";
import Signup from "./Signup";
import Products from "./Products";
import ViewProduct from "./ViewProduct";
import NewCart from "./NewCart"; // currently active
import Checkout from "./Checkout";
import OrderHistory from "./OrderHistory";
import ViewOrderDetails from "./ViewOrderDetails";
import Profile from "./Profile";
import Footer from "./Footer";
import AdminProducts from "./AdminProducts";

sessionStorage.setItem("BWUSERID", 1);
console.log("BWUSERID init:", sessionStorage.getItem("BWUSERID"));

const Logout = ({ isLoggedIn, setIsLoggedIn }) => {
  useEffect(() => {
    sessionStorage.clear();
    sessionStorage.setItem("BWUSERID", 1);
    setIsLoggedIn(false);
  }, [isLoggedIn]);
  return <Redirect to="/landingPage" />;
};

const App = () => {
  const [APIHealth, setAPIHealth] = useState("");
  const [currentProduct, setCurrentProduct] = useState({});
  const [purchasedOrder, setPurchasedOrder] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // follow this pattern inside your useEffect calls:
    // first, create an async function that will wrap your axios service adapter
    // invoke the adapter, await the response, and set the data
    const getAPIStatus = async () => {
      const { healthy } = await getAPIHealth();
      setAPIHealth(healthy ? "api is up! :D" : "api is down :/");
    };
  });

  return (
    <>
      <BrowserRouter>
        <Nav
          isLoggedIn={isLoggedIn}
          itemCount={itemCount}
          setItemCount={setItemCount}
        />

        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/products">
          <Products
            currentProduct={currentProduct}
            setCurrentProduct={setCurrentProduct}
            itemCount={itemCount}
            setItemCount={setItemCount}
          />
        </Route>
        <Route path="/viewProduct">
          <ViewProduct
            currentProduct={currentProduct}
            setCurrentProduct={setCurrentProduct}
          />
        </Route>

        <Route path="/login">
          <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </Route>
        <Route path="/signup">
          <Signup isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </Route>

        <Route path="/checkout">
          <Checkout itemCount={itemCount} setItemCount={setItemCount} />
        </Route>
        <Route path="/orderHistory">
          <OrderHistory
            purchasedOrder={purchasedOrder}
            setPurchasedOrder={setPurchasedOrder}
          />
        </Route>
        <Route path="/viewOrderDetails">
          <ViewOrderDetails
            purchasedOrder={purchasedOrder}
            setPurchasedOrder={setPurchasedOrder}
          />
        </Route>

        <Route path="/newcart">
          <NewCart itemCount={itemCount} setItemCount={setItemCount} />
        </Route>

        <Route path="/logout">
          <Logout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </Route>
        <Route path="/profile">
          <Profile isLoggedIn={isLoggedIn} />
        </Route>
        <Route path="/adminproducts">
          <AdminProducts isLoggedIn={isLoggedIn} />
        </Route>
      </BrowserRouter>
      <div id="footerSection">{/* <Footer /> */}</div>
    </>
  );
};

export default App;
