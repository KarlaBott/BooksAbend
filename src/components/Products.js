import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Products.css";
import { addOneItemToCart } from "../axios-services/prodpage";

const Products = ({ isAdmin, setCurrentProduct, itemCount, setItemCount }) => {
  const userId = sessionStorage.getItem("BWUSERID");
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [selFormat, setSelFormat] = useState("All");
  const [forceRender, setForceRender] = useState(false);
  const [fullProducts, setFullProducts] = useState([]);

  // if logged in as an Admin, then disable AddToCart button - cannot shop as an Admin
  const disabledButtonText = isAdmin ? "Admin View" : "Out of Stock";

  const bookFormats = ["Audio", "Hardback", "Paperback"];

  const fetchProducts = async () => {
    console.log("attempting fetchProducts ....");
    try {
      const response = await fetch(`api/products`);
      const result = await response.json();
      const productData = result.products;
      console.log(result);
      setProducts(productData);
      setFullProducts(productData);
    } catch (error) {
      console.error("failed to fetch products");
    }
  };

  useEffect(() => {
    if (fullProducts.length < 1) {
      fetchProducts();
    }
    if (bookFormats.includes(selFormat)) {
      setProducts(fullProducts.filter((el) => el.format == selFormat));
    } else {
      setProducts(fullProducts);
    }
    setForceRender(false);
  }, [forceRender]);

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

  const selFormatHandler = (ev) => {
    let formatChoice = ev.target.value;
    ev.preventDefault();
    if (bookFormats.includes(formatChoice)) {
      setSelFormat(formatChoice);
    } else {
      setSelFormat("All");
    }
    console.log("selFormatHandler > ", formatChoice);
    setForceRender(true);
  };

  return (
    <>
      <div id="searchSection">
        <img
          className="searchIcon"
          src="https://img.icons8.com/?size=512&id=e4NkZ7kWAD7f&format=png"
        />
        <input
          placeholder="search (title or author)..."
          type="search"
          id="searchInput"
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
        ></input>
        <label htmlFor="formatFilter">Format:</label>
        <select
          className="form-select"
          name="format"
          id="formatFilter"
          onChange={selFormatHandler}
        >
          <option value="All">All Formats</option>
          {bookFormats.map((item, idx) => (
            <option key={idx} value={item}>
              {item}
            </option>
          ))}
        </select>
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
                {isAdmin && (
                  <div className="productCard">
                    Cur Qty: {product.qtyavailable}
                  </div>
                )}
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
                  {product.qtyavailable > 0 && !isAdmin ? (
                    <button
                      className="cardButtons"
                      onClick={() => {
                        addItemToCart(product);
                      }}
                    >
                      <Link className="cardButtons" to="/products">
                        Add to Cart
                      </Link>
                    </button>
                  ) : (
                    <button disabled="disabled">{disabledButtonText}</button>
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
