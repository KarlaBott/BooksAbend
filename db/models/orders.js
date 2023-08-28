// file:  DB/ORDERS.JS

// grab db client connection to use with adapters
const client = require("../client");
const { getUserById, getUserByUsername, getGuestUserid } = require("./user");
const {
  changeOrderidForDetails,
  getOrderDetailsByOrderId,
} = require("./orderdetails");

// add your database adapter fns here
module.exports = {
  attachDetailsToOrders,
  createOrder,
  getAllOrders,
  getAllOrdersByUser,
  getOrderByOrderId,
  getOrderStatusById,
  getUserOrdersByStatus,
  setCurrentOrderToPurchased,
  updateCurrentGuestOrderForExistingUser,
  updateCurrentGuestOrderForNewUser,
  updateUseridForOrder,
};

let currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

async function createOrder({ status, userid, lastupdate }) {
  // add a new order.  Newly created orders will always be status="CURRENT"
  if (!status) status = "CURRENT";
  if (!lastupdate) lastupdate = currentDate;

  try {
    const {
      rows: [order],
    } = await client.query(
      `
      INSERT INTO orders (status, userid, lastupdate) 
      VALUES($1, $2, $3) 
      RETURNING *;
    `,
      [status, userid, lastupdate]
    );

    return order;
  } catch (error) {
    throw error;
  }
}

async function getAllOrders() {
  // select and return an array of all orders
  try {
    const { rows: orders } = await client.query(`
    SELECT orders.id, status, userid, u.username, lastupdate
      FROM orders
      JOIN users u ON u.id=orders.userid
    ;`);

    return orders;
  } catch (error) {
    throw error;
  }
}

async function attachDetailsToOrders(orders) {
  // INPUT:  orders - array of order objects
  // OUTPUT: orders - array of order objects with orderdetails attached
  // for each order, attach an array of corresponding orderdetails
  try {
    // sample return for ONE order that has THREE items in ORDERDETAIL:
    //  { id: 11,  status: 'PURCHASED',  userid: 4, username: 'karla',
    //     lastupdate: 2023-08-07T05:00:00.000Z,
    //     orderdetails: [
    //      { orderid: 11,  productid: 42,  quantity: 4, itemprice: '21.89',
    //        title: 'Electronic Concrete Chicken',
    //        author: 'Joannie Hayes' },
    //      { orderid: 11,  productid: 48,  quantity: 1, itemprice: '60.27',
    //        title: 'Licensed Plastic Cheese',
    //        author: 'Ottilie Goyette' },
    //      { orderid: 11,  productid: 52,  quantity: 4, itemprice: '36.43',
    //        title: 'Rustic Metal Table',
    //        author: 'Jamal Tillman' },   ]   }

    for (let i = 0; i < orders.length; i++) {
      let _user = await getUserById(orders[i].userid);
      // add username key to each order object
      orders[i].username = _user.username;
      // get all orderdetails for this order
      let orderid = orders[i].id;

      let qryStr = `SELECT
        od.orderid AS orderid,
        od.productid AS productid,
        od.quantity AS quantity,
        od.itemprice AS itemprice,
        prod.title AS title,
        prod.author AS author,
        prod.imageurl AS imageurl,
        prod.format AS format,
        prod.category AS category
        FROM orderdetails AS od
        JOIN products prod ON prod.id=od.productid
        WHERE od.orderid=${orderid} ;`;

      let { rows: orderdetails } = await client.query(qryStr);

      let itemCount = 0;
      let orderTotal = 0.0;
      for (let j = 0; j < orderdetails.length; j++) {
        itemCount += orderdetails[j].quantity;
        orderTotal +=
          parseFloat(orderdetails[j].itemprice) *
          parseFloat(orderdetails[j].quantity);
      }
      orders[i].totalitemcount = itemCount;
      orders[i].ordertotal = orderTotal.toFixed(2);

      // attach the orderdetails array to the orders object
      orders[i].orderdetails = orderdetails;
    }

    return;
  } catch (error) {
    throw error;
  }
}

async function getAllOrdersByUser({ username }) {
  // select and return an array of all orders made by user, include their orderdetails

  try {
    const user = await getUserByUsername(username);

    const { rows: orders } = await client.query(
      `SELECT * FROM orders WHERE userid = ${user.id};`
    );

    await attachDetailsToOrders(orders);

    return orders;
  } catch (error) {
    throw error;
  }
}

async function getOrderByOrderId({ id }) {
  // select and return an order matching the supplied id, include orderdetails

  try {
    const { rows: orders } = await client.query(
      `SELECT * FROM orders WHERE id = ${id};`
    );

    await attachDetailsToOrders(orders);

    return orders;
  } catch (error) {
    throw error;
  }
}

async function getOrderByOrderId({ id }) {
  // select and return an order matching the supplied id, include orderdetails

  try {
    const { rows: orders } = await client.query(
      `SELECT * FROM orders WHERE id = ${id};`
    );

    await attachDetailsToOrders(orders);

    return orders;
  } catch (error) {
    throw error;
  }
}

async function getOrderStatusById(id) {
  // select an order by id.  return an object with status key, or null
  // sample return:  { status: 'CURRENT' }
  try {
    const {
      rows: [order],
    } = await client.query(`SELECT status FROM orders WHERE id = ${id};`);

    return order;
  } catch (error) {
    throw error;
  }
}

async function getUserOrdersByStatus(status, userid) {
  // INPUT:  status - string, either "CURRENT" or "PURCHASED"
  // OUTPUT:  an an array of orders for the current user, include orderdetails
  //   if no matching order, then return empty array
  console.log("getUserOrdersByStatus > ", status, userid);

  if (!userid || userid < 1) return [];
  // make sure userid is an integer, and status is uppercase
  userid = parseInt(userid);
  status = status.toUpperCase();

  try {
    const { rows: orders } = await client.query(
      `
    SELECT * FROM orders
      WHERE status=$1
      AND userid=${userid}
      ORDER BY lastupdate DESC
    ;`,
      [status]
    );

    await attachDetailsToOrders(orders);
    // console.log("getUserOrdersByStatus > orders:", orders);
    return orders;
  } catch (error) {
    throw error;
  }
}

async function setCurrentOrderToPurchased(orderid) {
  // when user hits 'Confirm Purchase' ...
  // change the order.status field from CURRENT to PURCHASED, and lastupdate to currentDate
  // for the orders.id matching the supplied orderid
  // the API should only make this request with valid data (already verified there is a current order for current user)

  try {
    const {
      rows: [order],
    } = await client.query(
      `
    UPDATE orders SET status=$1, lastupdate=$2
    WHERE id=${orderid}
    RETURNING *;
  `,
      ["PURCHASED", currentDate]
    );

    // if the order was successfully changed to PURCHASED status,
    // then for each productid that exists in the orderdetails, the associated product.qtyavailable needs to be reduced by the number purchased
    if (order) {
      // get the orderdetails records for this order
      const orderdetails = await getOrderDetailsByOrderId(orderid);

      for (let x = 0; x < orderdetails.length; x++) {
        // for each orderdetails record, get the product record (just need the id and qtyavailable)
        const { rows: prodRecord } = await client.query(
          `SELECT id, qtyavailable FROM products
           WHERE id = ${orderdetails[x].productid}
          `
        );

        // subtract the number purchased from the qtyavailable.  if it is less than zero, then just set newQty to 0
        let newQty = prodRecord[0].qtyavailable - orderdetails[x].quantity;
        if (newQty < 0) {
          newQty = 0;
        }
        // update the product.qtyavailable field with the newQty
        await client.query(
          `UPDATE products SET qtyavailable = ${newQty}
           WHERE id = ${orderdetails[x].productid}
          `
        );
      }
    }

    return order;
  } catch (error) {
    throw error;
  }
}

async function updateUseridForOrder(orderid, newUserid) {
  // change the userid field associated with an order.id, also set lastupdate to currentDate
  try {
    const {
      rows: [order],
    } = await client.query(
      `
    UPDATE orders SET userid=$1, lastupdate=$2
    WHERE id=${orderid}
    RETURNING *;
  `,
      [newUserid, currentDate]
    );

    console.log("updateUseridForOrder: ", order);
    return order;
  } catch (error) {
    throw error;
  }
}

async function updateCurrentGuestOrderForNewUser(newUserId) {
  // called used when a new user registers
  //   if there is a CURRENT order for 'guest99' user, then change the userid on CURRENT order to the newUserId
  //   no orderdetails changed are needed, because only the userid associated with the order was updated
  newUserId = parseInt(newUserId);
  const guestUserid = await getGuestUserid();
  console.log("updateCurrentGuestOrderForNewUser > guestUserid", guestUserid);
  console.log("newUserId", newUserId);
  let guestId = 1;

  if (guestUserid?.id) {
    guestId = parseInt(guestUserid.id);
  } else {
    return null;
  }

  try {
    let currentOrder = await getUserOrdersByStatus("CURRENT", guestId);
    console.log("currentOrder", currentOrder);
    let currentOrderid = 0;
    // check to see if there is a CURRENT order for guestId
    if (!currentOrder || currentOrder.length < 1) {
      return null;
    } else {
      currentOrderid = parseInt(currentOrder[0].id);
    }
    console.log("currentOrderid", currentOrderid);
    // change the userid associated with the CURRENT order.id
    const order = updateUseridForOrder(currentOrderid, newUserId);

    console.log("updated order: ", order);
    return order;
  } catch (error) {
    throw error;
  }
}

async function updateCurrentGuestOrderForExistingUser(newUserId) {
  // called when an existing user logs in
  // if there is no curOrder (guest) and no prevOrder (CURRENT order.id for this user.id), then nothing to do
  // if there is ONLY a CURRENT order for guestUser, then change the userid on that order to the newUserId
  // if there is ONLY a CURRENT order for the now-logged in user, their previous order is now the CURRENT order
  // if there is both a CURRENT order for guestUser (did some anonymous shopping before they logged in),
  //   AND there is a CURRENT order for the now-logged-in user (previously left unpurchased items on an order)
  //  then all orderdetails items associated with the guestUser CURRENT order need to be changed to
  //   the now-logged-in user's user.id.
  newUserId = parseInt(newUserId);
  const guestUserid = await getGuestUserid();
  console.log("updCurGuestOrderForExistUser > guestUserid", guestUserid);
  console.log("newUserId:", newUserId);
  let guestId = 0;

  // identify the users.id for "guest99" - return if not found
  if (guestUserid?.id) {
    guestId = parseInt(guestUserid.id);
    console.log("guestId: ", guestId);
  } else {
    return null;
  }

  try {
    // check to see if there is a previously stored CURRENT order for the logged in user
    let prevOrder = await getUserOrdersByStatus("CURRENT", newUserId);
    console.log("prevOrder", prevOrder);
    let prevOrderid = 0;
    if (prevOrder && prevOrder.length > 0) {
      prevOrderid = parseInt(prevOrder[0].id);
    }
    console.log("prevOrderid:", prevOrderid);

    // check to see if there is a CURRENT order that was started as a guest
    let currentOrder = await getUserOrdersByStatus("CURRENT", guestId);
    console.log("currentOrder", currentOrder);
    let currentOrderid = 0;
    if (currentOrder && currentOrder.length > 0) {
      currentOrderid = parseInt(currentOrder[0].id);
    }
    console.log("currentOrderid", currentOrderid);

    // if no prevOrder and no curOrder, nothing to change
    if (prevOrderid < 1 && currentOrderid < 1) return;

    // if only a curOrder, then change the userid on that order to newUserid
    if (prevOrderid < 1 && currentOrderid > 0) {
      await updateUseridForOrder(currentOrderid, newUserId);
      const order = await getUserOrdersByStatus("CURRENT", newUserId);
      // console.log("curOrderOnly: ", order);
    }

    // if only a prevOrder, then the prevOrder for this user IS the current order, so return it
    if (prevOrderid > 0 && currentOrderid < 1) {
      const order = await getUserOrdersByStatus("CURRENT", newUserId);
      // console.log("prevOrderOnly: ", order);
    }

    // if user has both curOrder (items in guest cart), and prevOrder (prev CURRENT items for logged in user),
    // then bring all curOrder items into prevOrder, and delete the curOrder guestUser record
    if (prevOrderid > 0 && currentOrderid > 0) {
      const order = await updateUseridForOrder(prevOrderid, newUserId);
      await changeOrderidForDetails(currentOrderid, prevOrderid);
      await deleteOrder(currentOrderid);
      // console.log("both existed - curOrder updated: ", order);
    }

    return;
  } catch (error) {
    throw error;
  }
}

async function deleteOrder(id) {
  // delete an order - only called after all orderdetails have been added to a different orderid
  try {
    console.log("delete order: ", id);
    await client.query(
      `DELETE FROM orderdetails
         WHERE orderid = ${id};`
    );

    await client.query(
      `DELETE FROM orders
         WHERE id = ${id};`
    );

    console.log("DELETE orders complete for id:", id);
    return;
  } catch (error) {
    throw error;
  }
}
