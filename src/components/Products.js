import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Products.css";
import { addOneItemToCart } from "../axios-services/prodpage";

const Products = ({
  isAdmin,
  setCurrentProduct,
  itemCount,
  setItemCount,
  categoryNames,
}) => {
  const userId = sessionStorage.getItem("BWUSERID");
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [selFormat, setSelFormat] = useState("All");
  const [selCategory, setSelCategory] = useState("All");
  const [forceRender, setForceRender] = useState(false);
  const [fullProducts, setFullProducts] = useState([]);

  // if logged in as an Admin, then disable AddToCart button - cannot shop as an Admin
  const disabledButtonText = isAdmin ? "Admin View" : "Out of Stock";

  const bookFormats = ["Audio", "Hardback", "Paperback"];
  // categoryNames is an array of objects ... {categoryname: "Biography"}, so extract an array of the categoryname values
  const catNameArray = categoryNames.map((item) => item.categoryname);

  useEffect(() => {
    // if first time here, get the fullProducts
    if (fullProducts.length < 1) {
      fetchProducts();
    }
    // otherwise, check for filtered output
    // if both Format and Category have selections, filer on both
    if (bookFormats.includes(selFormat) && catNameArray.includes(selCategory)) {
      setProducts(
        fullProducts.filter(
          (el) => el.format == selFormat && el.category == selCategory
        )
      );
      // else if only Format is set, filter on that
    } else if (bookFormats.includes(selFormat)) {
      setProducts(fullProducts.filter((el) => el.format == selFormat));
      // else if only Category is set, filter on that
    } else if (catNameArray.includes(selCategory)) {
      setProducts(fullProducts.filter((el) => el.category == selCategory));
      // else no filters, so return fullProducts
    } else {
      setProducts(fullProducts);
    }
    setForceRender(false);
  }, [forceRender]);

  const fetchProducts = async () => {
    // console.log("attempting fetchProducts ....");
    try {
      const response = await fetch(`api/products`);
      const result = await response.json();
      const productData = result.products;
      // console.log(result);
      setProducts(productData);
      setFullProducts(productData);
    } catch (error) {
      console.error("ERROR: Products > fetchProducts", error);
    }
  };

  async function addItemToCart(product) {
    try {
      const result = await addOneItemToCart(product);
      // console.log("addItemToCart > result:", result);
      if (result.success) {
        setItemCount(itemCount + 1);
        // console.log("update itemCount:", itemCount);
      }
      return result;
    } catch (error) {
      console.error(`ERROR: Products > addItemToCart`, error);
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
    // console.log("selFormatHandler > ", selFormat);
    setForceRender(true);
  };

  const selCategoryHandler = (ev) => {
    let catChoice = ev.target.value;
    ev.preventDefault();
    if (catNameArray.includes(catChoice)) {
      setSelCategory(catChoice);
    } else {
      setSelCategory("All");
    }
    // console.log("selCategoryHandler > ", selCategory);
    setForceRender(true);
  };

  return (
    <>
      <section id="searchSection">
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
          value={selFormat}
          onChange={selFormatHandler}
        >
          <option value="All">All Formats</option>
          {bookFormats.map((item, idx) => (
            <option key={idx} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label htmlFor="catFilter">Category:</label>
        <select
          className="form-select"
          name="category"
          id="catFilter"
          value={selCategory}
          onChange={selCategoryHandler}
        >
          <option value="All">All Categories</option>
          {categoryNames.map((item, idx) => (
            <option key={idx} value={item.categoryname}>
              {item.categoryname}
            </option>
          ))}
        </select>

        <button
          className="form-select"
          id="formatFilter"
          onClick={() => {
            setSelCategory("All");
            setSelFormat("All");
            setProducts(fullProducts);
            setForceRender(true);
          }}
        >
          Reset Filters
        </button>
      </section>

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
