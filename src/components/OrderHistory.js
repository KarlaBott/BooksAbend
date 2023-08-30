import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Products.css";
import "../style/ViewOrderDetails.css";
import LandingPage_Background from "../Images/BookWanderer_LandingPageBackground.png";

const OrderHistory = ({ purchasedOrder, setPurchasedOrder }) => {
  const userId = sessionStorage.getItem("BWUSERID");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchPurchasedOrders() {
      console.log("fetchPurchasedOrders ...");
      try {
        const response = await fetch(`api/orders/status/purchased/${userId}`);
        const result = await response.json();
        const orderData = result.userOrders;
        console.log(result);
        setOrders(orderData);
      } catch (error) {
        console.error("failed to fetch PURCHASED orders");
      }
    }
    fetchPurchasedOrders();
  }, []);

  if (!orders || orders.length < 1) {
    return (
      <section id="textCenter">
        <h2>No previous orders to display.</h2>
        <img className="background" src={LandingPage_Background}></img>
      </section>
    );
  }

  return (
    <>
      <div id="productsBody">
        {orders.map((order) => (
          <div className="row" key={order.id}>
            <div id="productsContainer" key={order.id}>
              <div className="productCard">
                Order Date: {order.lastupdate.substring(0, 10)}
              </div>
              <div className="productCard">Order Id: {order.id}</div>
              <div className="productCard">
                Total Items Purchased: {order.totalitemcount}
              </div>
              <div className="productCard">
                Order Total: ${order.ordertotal}
              </div>

              <div className="cardButtonSection">
                <button
                  className="cardButtons"
                  id="detailsButton"
                  onClick={() => {
                    setPurchasedOrder(order);
                  }}
                >
                  <Link className="cardButtons" to="/viewOrderDetails">
                    See Order Details
                  </Link>
                </button>
              </div>
              <img
                id="approved"
                src="https://png.pngtree.com/png-clipart/20221010/original/pngtree-original-approved-stamp-and-badget-design-red-grunge-png-image_8669616.png"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderHistory;
