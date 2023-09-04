import React, { useEffect, useState } from "react";
import "../style/Checkout.css";
import books from "../Images/openbook.png";

const Checkout = ({ itemCount, setItemCount }) => {
  const userId = sessionStorage.getItem("BWUSERID");
  const [order, setOrder] = useState([]);
  const [checkOutComplete, setCheckoutComplete] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      // console.log("Checkout > fetchOrder CURRENT ...");
      try {
        const response = await fetch(`api/orders/status/current/${userId}`);
        const result = await response.json();

        if (result?.userOrders?.length > 0) {
          // if got a valid response, then setOrder to the first item in the array (there should only be one CURRENT order)
          setOrder(result.userOrders[0]);
        } else {
          // setOrder to an empty array
          setOrder([]);
        }
      } catch (error) {
        console.error("ERROR: Checkout > fetchOrder", error);
      }
    }
    fetchOrder();
  }, []);

  async function submitOrder(event) {
    event.preventDefault();
    try {
      // console.log("Checkout > PATCH - orderid:", order.id);
      const response = await fetch(`api/orders/${order.id}`, {
        method: "PATCH",
      });
      const result = await response.json();
      // console.log("PATCH result:", result);
      if (result?.updatedOrder?.status === "PURCHASED") {
        setCheckoutComplete(true);
        setItemCount(0);
      }
    } catch (error) {
      console.error("ERROR: Checkout > submitOrder", error);
    }
  }

  if (Array.isArray(order)) {
    return (
      <section id="textCenter">
        <h2>No items to display.</h2>
        <h2>Select PRODUCTS to begin adding items to your order.</h2>
        <img className="background" src={books}></img>
      </section>
    );
  }

  return (
    <>
      <div className="bgimage" id="checkoutPage">
        <section className="component">
          <div className="total">
            <h3>TOTAL</h3>
            <p>${order.ordertotal}</p>
          </div>

          <div className="credit-card">
            <h2>CHECKOUT - ORDER ID: {order.id}</h2>
            <h2>{order.totalitemcount} item(s) included in this order</h2>
            <h3 id="infoMsg">
              (This is a mock form - no info needed. Review total and click
              "PLACE ORDER" at the bottom.)
            </h3>
            <form>
              <input type="text" placeholder={order.username.toUpperCase()} />
              <input type="text" placeholder="Email Address" />
              <div className="line">
                <input type="text" placeholder="Card Number" />
              </div>
              <div className="line">
                <input
                  className="litle"
                  type="text"
                  placeholder="Expiration Date"
                />
                <input className="tall" type="text" placeholder="CCV" />
              </div>
              {checkOutComplete ? (
                <div className="line">
                  <h3 id="infoMsg">
                    Thank you for shopping with us. Your order is complete.
                    {"\n"}
                  </h3>
                  <h3 id="infoMsg">Please note your OrderId.</h3>
                </div>
              ) : (
                <button
                  type="submit"
                  className="valid-button"
                  onClick={submitOrder}
                >
                  PLACE ORDER
                </button>
              )}
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default Checkout;
