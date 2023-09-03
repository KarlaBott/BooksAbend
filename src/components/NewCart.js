import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Products.css";
import "../style/ViewOrderDetails.css";
import books from "../Images/openbook.png";
import swal from "sweetalert";

const NewCart = ({ itemCount, setItemCount }) => {
  const userId = sessionStorage.getItem("BWUSERID");
  const [currentOrder, setCurrentOrder] = useState([]);
  const [forceRender, setForceRender] = useState(false);

  useEffect(() => {
    async function fetchCurrentOrder() {
      try {
        const response = await fetch(`api/orders/status/current/${userId}`);
        const result = await response.json();
        const orderData = result.userOrders;
        // orderData is an array of CURRENT orders, and there should only ever be ONE order in it
        // console.log("NewCart > result:", result);
        if (orderData?.length > 0) {
          setCurrentOrder(orderData[0]);
          setItemCount(orderData[0].totalitemcount);
          // console.log("fetchCurrentOrder > itemCount:", itemCount);
        } else {
          setCurrentOrder([]);
        }
      } catch (error) {
        console.error("ERROR: NewCart > fetchCurrentOrder", error);
      }
    }
    fetchCurrentOrder();
    setForceRender(false);
  }, [forceRender]);

  async function adjustCart(strAddSub, orderid, productid, curQty) {
    // console.log("adjustCart > parm:", strAddSub, orderid, productid, curQty);
    try {
      // get product record for productid
      const prodFetch = await fetch(`api/products/${productid}`);
      const prodResponse = await prodFetch.json();
      // console.log("prodResponse", prodResponse);
      let response = {};

      // if DEL, then run DELETE to remove the orderdetail record from the order
      if (strAddSub == "DEL") {
        // console.log("adjustCart > DELETE");
        response = await fetch(`api/orderdetails/${orderid}/${productid}`, {
          method: "DELETE",
        });
      } else {
        // if trying to add, but there are no more available, flash an alert
        if (strAddSub == "ADD" && prodResponse.qtyavailable <= curQty) {
          swal("", "No more available!", "error", {
            button: false,
            timer: 1600,
          });
          setForceRender(true);
          return;
        }
        // else change the orderdetail quantity for this item
        let newQty = strAddSub == "ADD" ? curQty + 1 : curQty - 1;
        // console.log("adjustCart > PATCH > newQty:", newQty);
        response = await fetch(`api/orderdetails/${orderid}/${productid}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQty }),
        });
      }
      const result = await response.json();
      // console.log("adjustCart > result:", result);
      setForceRender(true);
      return result;
    } catch (error) {
      console.error(`ERROR: NewCart > adjustCart`, error);
    }
  }

  // generate info for single orderdetail item
  function writeOneItem(pOneItem) {
    return (
      <>
        <div className="productCard">{pOneItem.title}</div>
        <div id="imgSection">
          <img id="productImg" src={pOneItem.imageurl} alt={pOneItem.title} />
        </div>
        <div className="productCard">By: {pOneItem.author}</div>
        <div className="productCard">
          {pOneItem.format}, {pOneItem.category}
        </div>
        <div className="productCard">Item Price: ${pOneItem.itemprice}</div>
        <div className="productCard">Quantity: {pOneItem.quantity}</div>
      </>
    );
  }

  // if there is no order for BWUSERID, then the currentOrder is an empty ARRAY
  if (Array.isArray(currentOrder)) {
    return (
      <section id="textCenter">
        <button id="addPadding" disabled="disabled" className="cardButton">
          Proceed to Checkout
        </button>
        <button id="addPadding" className="cardButtons">
          <Link to="/products" className="cardButtons">
            Continue Shopping
          </Link>
        </button>
        <h2>There are no items in your shopping cart.</h2>
        <h2>Select PRODUCTS to start adding items to your cart.</h2>
        <img className="background" src={books}></img>
      </section>
    );
  }
  // otherwise, currentOrder is an OBJECT
  return (
    <>
      <section id="orderHeader">
        <section id="cartHdrVerbiage">
          <div>CURRENT cart items for Order ID: {currentOrder.id}</div>
          <div>Number of Items: {currentOrder.totalitemcount}</div>
          <div>Order Total: ${currentOrder.ordertotal}</div>
          <div>
            {" "}
            - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -{" "}
          </div>
          <div style={{ fontWeight: 800, fontStyle: "italic" }}>
            {"\n"}ITEMS INCLUDED IN THIS ORDER (shown below) . . .
          </div>
        </section>

        <section id="cartHdrButtons">
          {itemCount < 1 ? (
            <button id="addPadding" disabled="disabled" className="cardButton">
              Proceed to Checkout
            </button>
          ) : (
            <button id="addPadding" className="cardButtons">
              <Link to="/checkout" className="cardButtons">
                Proceed to Checkout
              </Link>
            </button>
          )}
          <button id="addPadding" className="cardButtons">
            <Link to="/products" className="cardButtons">
              Continue Shopping
            </Link>
          </button>
        </section>
      </section>
      <div id="productsBody">
        {currentOrder.orderdetails.map((orderDetail) => (
          <div className="row" key={orderDetail.productid}>
            <div id="productsContainer">
              {writeOneItem(orderDetail)}
              <div className="cardButtonSection">
                <button
                  className="cardButtons"
                  onClick={() => {
                    adjustCart(
                      "ADD",
                      currentOrder.id,
                      orderDetail.productid,
                      orderDetail.quantity
                    );
                  }}
                >
                  <Link className="cardButtons" to="/newcart">
                    Add One
                  </Link>
                </button>
                <button
                  className="cardButtons"
                  onClick={() => {
                    adjustCart(
                      orderDetail.quantity > 1 ? "SUB" : "DEL",
                      currentOrder.id,
                      orderDetail.productid,
                      orderDetail.quantity
                    );
                  }}
                >
                  {orderDetail.quantity > 1 ? (
                    <Link className="cardButtons" to="/newcart">
                      Remove One
                    </Link>
                  ) : (
                    <Link className="cardButtons" to="/newcart">
                      Delete Item
                    </Link>
                  )}
                </button>

                {orderDetail.quantity > 1 && (
                  <button
                    className="cardButtons"
                    onClick={() => {
                      adjustCart(
                        "DEL",
                        currentOrder.id,
                        orderDetail.productid,
                        orderDetail.quantity
                      );
                    }}
                  >
                    <Link className="cardButtons" to="/newcart">
                      Delete Item
                    </Link>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NewCart;
