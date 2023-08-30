import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "../style/ViewProduct.css";
import "../style/Products.css";
import { addOneItemToCart } from "../axios-services/prodpage";

const ViewProduct = ({ currentProduct, itemCount, setItemCount }) => {
  console.log("single view has", currentProduct);
  const stockImg = currentProduct.imageurl;

  async function addItemToCart(product) {
    try {
      const result = await addOneItemToCart(product);
      console.log("addItemToCart > result:", result);
      if (result.success) {
        setItemCount(itemCount + 1);
        console.log("update itemCount:", itemCount);
      }
      return result;
    } catch (error) {
      console.error(`An error occured when adding item to cart.`);
    }
  }

  return (
    <>
      <button className="return">
        <Link to="/products" className="cardButtons">
          Return
        </Link>
      </button>
      <div id="viewProductPage">
        <div id="vPPhoto">
          <img src={stockImg} alt={currentProduct.title} id="vpI" />
        </div>
        <aside>
          <div id="viewItemSection">
            <div className="viewProductLine"> {currentProduct.title}</div>
            <div className="viewProductLine">By: {currentProduct.author}</div>
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
              className="cardButtons"
              id="viewProductATCButton"
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
