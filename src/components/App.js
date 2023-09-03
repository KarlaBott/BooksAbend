import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
// getAPIHealth is defined in our axios-services directory index.js
import { getAPIHealth } from "../axios-services";
import { fetchAllCategories } from "../axios-services/products";
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
import AdminProducts from "./AdminProducts";
import Footer from "./Footer";

sessionStorage.setItem("BWUSERID", 1);
sessionStorage.setItem("BWUSERNAME", "");
// console.log("BWUSERID init:", sessionStorage.getItem("BWUSERID"));

const Logout = ({ isLoggedIn, setIsLoggedIn, setIsAdmin }) => {
  useEffect(() => {
    sessionStorage.clear();
    sessionStorage.setItem("BWUSERID", 1);
    sessionStorage.setItem("BWUSERNAME", "");
    setIsAdmin(false);
    setIsLoggedIn(false);
  }, [isLoggedIn]);
  return <Redirect to="/" />;
};

const App = () => {
  const [APIHealth, setAPIHealth] = useState("");
  // categoryNames - used to present a list of available book categories
  const [categoryNames, setCategoryNames] = useState([]);
  // currentProducts shared between /products and /viewproducts
  const [currentProduct, setCurrentProduct] = useState({});
  // isLoggedIn - is the current user logged in?
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // isAdmin - is the currently logged in user an Admin user?
  const [isAdmin, setIsAdmin] = useState(false);
  // itemCount - number of items in the CURRENT order/cart
  const [itemCount, setItemCount] = useState(0);
  // purchasedOrder - shared between /orderhistory and /vieworderdetails
  const [purchasedOrder, setPurchasedOrder] = useState({});

  const getCategoryNames = async () => {
    try {
      const data = await fetchAllCategories();
      setCategoryNames(data.categories);
    } catch (error) {
      console.error("ERROR: App > fetchAllCategories: ", error);
    }
  };

  useEffect(() => {
    // follow this pattern inside your useEffect calls:
    // first, create an async function that will wrap your axios service adapter
    // invoke the adapter, await the response, and set the data
    const getAPIStatus = async () => {
      const { healthy } = await getAPIHealth();
      setAPIHealth(healthy ? "api is up! :D" : "api is down :/");
    };
    getCategoryNames();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Nav
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          itemCount={itemCount}
          setItemCount={setItemCount}
        />

        <Route exact path="/">
          <LandingPage />
        </Route>

        <Route path="/products">
          <Products
            isAdmin={isAdmin}
            currentProduct={currentProduct}
            setCurrentProduct={setCurrentProduct}
            itemCount={itemCount}
            setItemCount={setItemCount}
            categoryNames={categoryNames}
          />
        </Route>

        <Route path="/viewProduct">
          <ViewProduct
            isAdmin={isAdmin}
            currentProduct={currentProduct}
            setCurrentProduct={setCurrentProduct}
            itemCount={itemCount}
            setItemCount={setItemCount}
          />
        </Route>

        <Route path="/login">
          <Login
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
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

        <Route path="/profile">
          <Profile isLoggedIn={isLoggedIn} categoryNames={categoryNames} />
        </Route>
        <Route path="/adminproducts">
          <AdminProducts
            isLoggedIn={isLoggedIn}
            categoryNames={categoryNames}
          />
        </Route>

        <Route path="/logout">
          <Logout
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        </Route>
      </BrowserRouter>
      <div id="footerSection">{/* <Footer /> */}</div>
    </>
  );
};

export default App;
