import React from "react";
import { Link } from "react-router-dom";
import "../style/Products.css";
import "../style/ViewOrderDetails.css";
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

const ViewOrderDetails = ({ purchasedOrder }) => {
  return (
    <>
      <section id="orderHeader">
        <button id="addPadding" className="cardButtons">
          <Link to="/orderhistory" className="cardButtons">
            Return to OrderHistory
          </Link>
        </button>

        <div>
          Details for ORDER ID:{"  "} {purchasedOrder.id}
        </div>
        <div>
          Purchased on:{"  "} {purchasedOrder.lastupdate.substring(0, 10)}
        </div>
        <div>
          Number of Items:{"  "} {purchasedOrder.totalitemcount}
        </div>
        <div>
          Order Total:{"  "} ${purchasedOrder.ordertotal}
        </div>
        <div>
          {" "}
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -{" "}
        </div>
        <div>Items included in this order . . .</div>
      </section>
      <div id="productsBody">
        {purchasedOrder.orderdetails.map((orderDetail) => (
          <div className="row" key={orderDetail.productid}>
            <div id="productsContainer">{writeOneItem(orderDetail)}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ViewOrderDetails;
