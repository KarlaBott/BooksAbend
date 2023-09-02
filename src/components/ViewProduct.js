import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "../style/Products.css";
import "../style/ViewProduct.css";
import { addOneItemToCart } from "../axios-services/prodpage";

const ViewProduct = ({ isAdmin, currentProduct, itemCount, setItemCount }) => {
  // console.log("ViewProduct > curProd:", currentProduct);
  const stockImg = currentProduct.imageurl;
  // if logged in as an Admin, then disable AddToCart button - cannot shop as an Admin
  const disabledButtonText = isAdmin ? "Admin View" : "Out of Stock";

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
      <div id="viewProductPage">
        <div id="vPPhoto">
          <img src={stockImg} alt={currentProduct.title} id="vpI" />
        </div>
        <aside>
          <div id="viewItemSection">
            <button id="addPadding" className="cardButtons">
              <Link to="/products" className="cardButtons">
                Return to Products
              </Link>
            </button>

            <div className="viewProductLine"> {currentProduct.title}</div>
            <div className="viewProductLine">By: {currentProduct.author}</div>
            {/* <img src={stockImg} alt={currentProduct.title} id="vpI" /> */}
            <div className="viewProductLine">
              Price: ${currentProduct.price}
            </div>
            <div className="viewProductLine">
              {currentProduct.format}, {currentProduct.category}
            </div>
            <div className="viewProductLine">
              Quantity Available: {currentProduct.qtyavailable}
            </div>
            <div className="viewProductLine">
              Overview: {currentProduct.overview}
            </div>

            {currentProduct.qtyavailable > 0 && !isAdmin ? (
              <button
                className="cardButtons"
                id="addPadding"
                onClick={() => {
                  addItemToCart(currentProduct);
                }}
              >
                Add to Cart
              </button>
            ) : (
              <button
                disabled="disabled"
                id="addPadding"
                className="cardButton"
              >
                {disabledButtonText}
              </button>
            )}
          </div>
        </aside>
        {/* ------------- */}
      </div>
    </>
  );
};

export default ViewProduct;
