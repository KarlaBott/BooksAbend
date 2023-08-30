import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "../style/Products.css";
import swal from "sweetalert";
import { addOneItemToCart } from "../axios-services/prodpage";

const Products = ({ setCurrentProduct, itemCount, setItemCount }) => {
  const userId = sessionStorage.getItem("BWUSERID");
  const [products, SetProducts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      console.log("attempting to fectch products....");
      try {
        const response = await fetch(`api/products`);
        const result = await response.json();
        const productData = result.products;
        // console.log(result);
        SetProducts(productData);
      } catch (error) {
        console.error("failed to fetch products");
      }
    }
    fetchProducts();
  }, []);

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
      <div id="searchSection">
        <img
          className="searchIcon"
          src="https://img.icons8.com/?size=512&id=e4NkZ7kWAD7f&format=png"
        />
        <input
          placeholder="search..."
          type="search"
          id="searchInput"
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
        ></input>
      </div>
      <div id="productsBody">
        {products
          .filter(
            (product) =>
              product.title.toLowerCase().includes(query) ||
              product.author.toLowerCase().includes(query)
          )
          .map((product) => (
            <div className="row" key={product.id}>
              <div id="productsContainer" key={product.id}>
                <div className="productCard">{product.title}</div>
                <div className="productCard">By: {product.author}</div>
                <div id="test">
                  <div id="imgSection">
                    <img
                      id="productImg"
                      src={product.imageurl}
                      alt={product.title}
                    />
                  </div>
                </div>
                <div className="productCard">{product.format}</div>
                <div className="productCard">${product.price}</div>
                <div className="cardButtonSection">
                  <button
                    className="cardButtons"
                    id="detailsButton"
                    onClick={() => {
                      setCurrentProduct(product);
                    }}
                  >
                    <Link className="cardButtons" to="/viewProduct">
                      See Details
                    </Link>
                  </button>
                  {product.qtyavailable > 0 ? (
                    <button
                      className="cardButtons"
                      id="cartButton"
                      onClick={() => {
                        addItemToCart(product);
                      }}
                    >
                      <Link
                        className="cardButtons"
                        id="cartButton"
                        to="/products"
                      >
                        Add to Cart
                      </Link>
                    </button>
                  ) : (
                    <button disabled="disabled" className="cartButton">
                      Out of Stock
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

export default Products;
