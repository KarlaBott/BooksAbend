import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Nav.css";

const Nav = ({ isLoggedIn, isAdmin, itemCount, setItemCount }) => {
  const userId = sessionStorage.getItem("BWUSERID");
  const userName = sessionStorage.getItem("BWUSERNAME");

  useEffect(() => {
    async function fetchCurrentOrder() {
      try {
        const response = await fetch(`api/orders/status/current/${userId}`);
        const result = await response.json();
        if (result?.userOrders?.length > 0) {
          // if got a valid response, then setItemCount (sh only be 1 element in the array of CURRENT orders)
          setItemCount(result.userOrders[0].totalitemcount);
        } else {
          // otherwise, setItemCount to zero
          setItemCount(0);
        }
        console.log("NAV > itemCount:", itemCount);
      } catch (error) {
        console.error("failed to fetch CURRENT order");
      }
    }
    fetchCurrentOrder();
  }, [isLoggedIn, itemCount]);

  return (
    <>
      <div id="nav">
        <nav>
          <div id="logoSection">
            <img
              id="websiteLogo"
              src="https://media.istockphoto.com/id/1328167226/vector/open-book.jpg?s=612x612&w=0&k=20&c=yqfKR7Es5IDuM20rtyg4xZihaGTl2waDtvucK1YCTIw="
              alt="logo"
            />
            <h1 id="title">Books Abend</h1>
            {isLoggedIn && (
              <p id="usernameDisplay">
                Signed in as: {"   "}{" "}
                <span style={{ fontWeight: 999, fontStyle: "italic" }}>
                  {userName}
                </span>
              </p>
            )}
          </div>
          <div id="navSelections">
            <Link className="link" to="/">
              Home
            </Link>
            <Link className="link" to="/products">
              Products
            </Link>
            {!isAdmin && (
              <Link className="link" to="/newcart">
                CART {" ("}
                {itemCount}
                {")"}
              </Link>
            )}

            {!isLoggedIn && (
              <Link className="link" to="/login">
                Login
              </Link>
            )}
            {!isLoggedIn && (
              <Link className="link" to="/signup">
                SignUp
              </Link>
            )}
            {isLoggedIn && !isAdmin && (
              <Link className="link" to="/orderhistory">
                Order History
              </Link>
            )}
            {isLoggedIn && (
              <Link className="link" to="/profile">
                Profile
              </Link>
            )}
            {isLoggedIn && (
              <Link className="link" to="/logout">
                Logout
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};
export default Nav;
