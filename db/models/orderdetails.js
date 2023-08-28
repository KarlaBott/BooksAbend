// file:  DB/ORDERS.JS

// grab our db client connection to use with our adapters
const client = require("../client");

// add your database adapter fns here
module.exports = {
  changeOrderidForDetails,
  createOrderDetailItem,
  deleteOrderDetails,
  getAllOrderDetails,
  getOrderDetailsByIds,
  getOrderDetailsByOrderId,
  updateOrderDetails,
};

async function createOrderDetailItem({
  orderid,
  productid,
  quantity,
  itemprice,
}) {
  // add one new order detail item to an existing orderid
  // OUTPUT:  return an array of the orderdetails item that was added
  //          returns an empty array if there was conflict.
  try {
    const {
      rows: [OrderDetailItem],
    } = await client.query(
      `
      INSERT INTO orderdetails (orderid, productid, quantity, itemprice) 
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT (orderid, productid) DO NOTHING 
      RETURNING *;
    `,
      [orderid, productid, quantity, itemprice]
    );

    return OrderDetailItem;
  } catch (error) {
    throw error;
  }
}

async function getAllOrderDetails() {
  // select and return an array of all orderdetails records
  try {
    const { rows: orderdetails } = await client.query(
      `SELECT * FROM orderdetails;`
    );

    return orderdetails;
  } catch (error) {
    throw error;
  }
}

async function getOrderDetailsByOrderId(pOrderId) {
  // select and return an array of all orderdetails records that match pOrderId
  try {
    const { rows: orderdetails } = await client.query(`
     SELECT * FROM orderdetails
     WHERE orderid=${pOrderId}
     ;`);

    return orderdetails;
  } catch (error) {
    throw error;
  }
}

async function getOrderDetailsByIds(orderid, productid) {
  // select and return an array of one  orderdetails record object matching a specific orderid and productid
  //  an empty array will be returned if no records match
  try {
    const { rows: orderdetails } = await client.query(`
     SELECT * FROM orderdetails
     WHERE orderid=${orderid}
     AND productid=${productid}
     ;`);

    // console.log("orderdetails : ", orderdetails);
    return orderdetails;
  } catch (error) {
    throw error;
  }
}

async function updateOrderDetails({ orderid, productid, ...fields }) {
  // Update orderdetails entry:   orderid and primary key comprise the primary key for this table
  // remove these two primary key fields from the passedin fields object, so they are not part of setString
  delete fields.orderid;
  delete fields.productid;

  // Update quantity and/or item price
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [orderdetail],
    } = await client.query(
      `
    UPDATE orderdetails
    SET ${setString}
    WHERE orderid=${orderid}
    AND productid=${productid}
    RETURNING *;
  `,
      Object.values(fields)
    );

    return orderdetail;
  } catch (error) {
    throw error;
  }
}

async function deleteOrderDetails(orderid, productid) {
  // remove order detail record from database
  // the API call has already verified (using getOrderDetailsByIds) that the record exists and can be deleted
  try {
    await client.query(
      `DELETE FROM orderdetails
       WHERE orderid = ${orderid}
       AND productid = ${productid};`
    );

    console.log("DELETE orderdetails complete for: ", orderid, productid);
    return;
  } catch (error) {
    throw error;
  }
}

async function changeOrderidForDetails(oldOrderid, newOrderid) {
  // change the orderid for a selected set of orderdetails (supports guest user registered or logged in)
  oldOrderid = parseInt(oldOrderid);
  newOrderid = parseInt(newOrderid);

  console.log("changeOrderidForDetails");
  try {
    // get an array of newOrderId details objects
    let { rows: newProds } = await client.query(
      `SELECT orderid, productid, quantity FROM orderdetails
       WHERE orderid=${newOrderid} ;`
    );

    // get an array of oldOrderid details objects
    let { rows: oldProds } = await client.query(
      `SELECT orderid, productid, quantity FROM orderdetails
       WHERE orderid=${oldOrderid} ;`
    );

    // set an array of new productids
    let newProdAry = newProds.map(({ productid }) => productid);
    // set an array of old productids
    let oldProdAry = oldProds.map(({ productid }) => productid);

    // go through the array of old productids, and check to see if any of these productids already exist in
    // the newOrderId orderdetails list.  If there is overlap, add the old quantity to the new one, and delete old orderdetails record
    for (let i = 0; i < oldProdAry.length; i++) {
      // if the newProdAry includes a product id from the old list
      if (newProdAry.includes(oldProdAry[i])) {
        let newPos = newProdAry.indexOf(oldProdAry[i]);
        let newQty = newProds[newPos].quantity + oldProds[i].quantity;
        // add the old quantity value to the neworderid for this same productid
        await client.query(
          `UPDATE orderdetails
           SET quantity=${newQty}
           WHERE orderid=${newOrderid} ;`
        );
        // delete the old orderdetails record
        await client.query(
          `DELETE FROM orderdetails
             WHERE orderid = ${oldOrderid}
             AND productid = ${oldProdAry[i]};`
        );
      }
    }

    await client.query(
      `UPDATE orderdetails
       SET orderid=${newOrderid}
       WHERE orderid=${oldOrderid} ;`
    );

    console.log("orderdetails orderid update complete");
    return;
  } catch (error) {
    // deliberately ignore any error on this processing (there shouldn't be one, but don't interrupt if there is)
    console.log("changeOrderidForDetails > error: ", error.message);
    return;
  }
}
