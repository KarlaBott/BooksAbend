import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "../style/Products.css";

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
    console.log("adding this item to cart", product);
    try {
      const response = await fetch(`api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userId,
          productid: product.id,
          itemprice: product.price,
          quantity: 1,
        }),
      });
      const result = await response.json();
      console.log("addItemToCart:", result);
      if (result?.orderDetail) {
        if (result?.orderDetail[0]?.message == "NOT_ENOUGH") {
          console.log("not enough");
          alert(
            "Sorry - there are not more of this item to add to your order."
          );
        } else {
          setItemCount(itemCount + 1);
          console.log("update itemCount to:", itemCount);
          alert("Added item to cart!");
        }
      }
      return result;
    } catch (error) {
      console.error(`An error occured when adding item to cart.`);
    }
  }

  return (
    <>
      <label htmlFor="searchInput" id="searchLabel">
        Search
      </label>
      <input
        placeholder="search..."
        type="search"
        id="searchInput"
        onChange={(e) => setQuery(e.target.value.toLowerCase())}
      ></input>

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
                <div id="imgSection">
                  <img
                    id="productImg"
                    src={product.imageurl}
                    alt={product.title}
                  />
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
                        // console.log(product);
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
