import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "../style/ViewProduct.css";
//pass currentProduct through this function as prop

const ViewProduct = ({ currentProduct }) => {
  console.log("single view has", currentProduct);
  const stockImg = currentProduct.imageurl;

  async function addItemToCart(product) {
    console.log("adding this item to cart", currentProduct);
    try {
      const response = await fetch(`api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: 1,
          userid: sessionStorage.getItem("BWUSERID"),
          productid: currentProduct.id,
          quantity: 1,
          itemprice: currentProduct.price,
        }),
      });
      const result = await response.json();
      console.log(result);
      if (result?.orderDetail) {
        alert("Added item to cart!");
      }
      return result;
    } catch (error) {
      console.error(`An error occured when adding item to cart.`);
    }
  }

  return (
    <>
      <button>
        <Link to="/products">Return</Link>
      </button>
      <div id="viewProductPage">
        <div id="vPPhoto">
          <img src={stockImg} alt={currentProduct.title} id="vpI" />
        </div>
        <aside>
          <div id="viewItemSection">
            <div className="viewProductLine">Title:{currentProduct.title}</div>
            <div className="viewProductLine">
              Author:{currentProduct.author}
            </div>
            {/* <img src={stockImg} alt={currentProduct.title} id="vpI" /> */}
            <div className="viewProductLine">
              Price: ${currentProduct.price}
            </div>
            <div className="viewProductLine">
              Format: {currentProduct.format}
            </div>
            <div className="viewProductLine">
              Qty Available: {currentProduct.qtyavailable}
            </div>
            <div className="viewProductLine">
              Overview: {currentProduct.overview}
            </div>

            {/* use ternery op ex: if isLoggedIn = true return Cart.js else return Login.js */}
            <button
              onClick={() => {
                // console.log(product);
                addItemToCart(currentProduct);
              }}
            >
              Add to Cart
            </button>
          </div>
        </aside>
        {/* ------------- */}
      </div>
    </>
  );
};

export default ViewProduct;
