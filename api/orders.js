const express = require("express");
const ordersRouter = express.Router();

const {
  createOrder,
  createOrderDetailItem,
  getAllOrders,
  getAllOrdersByUser,
  getOrderByOrderId,
  getOrderDetailsByIds,
  getOrderStatusById,
  getProductsById,
  getUserByUsername,
  getUserOrdersByStatus,
  setCurrentOrderToPurchased,
  updateOrderDetails,
} = require("../db");

ordersRouter.use((req, res, next) => {
  console.log("A request is being made to /api/orders - next() is called ...");
  next();
});

// GET /api/orders - Return a list of all orders
ordersRouter.get("/", async (req, res, next) => {
  console.log("A request is being made to GET /api/orders ...");
  // console.log("req.body is ", req.body);
  try {
    const orders = await getAllOrders();
    res.send({ orders });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:username - Get a list of all orders for specified user, include orderdetails
ordersRouter.get("/:username", async (req, res, next) => {
  console.log("A request is being made to GET /orders/username/:username ...");
  console.log("req.params : ", req.params);
  console.log("req.body : ", req.body);

  try {
    const userOrders = await getAllOrdersByUser({
      username: req.params.username,
    });

    res.send({ userOrders });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/id/:id - Get an order matching id, include orderdetails
ordersRouter.get("/id/:id", async (req, res, next) => {
  console.log("A request is being made to GET /orders/id/:id ...");
  console.log("req.params : ", req.params);
  console.log("req.body : ", req.body);

  try {
    const userOrder = await getOrderByOrderId({ id: parseInt(req.params.id) });

    res.send({ userOrder });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/status/:status/:id - Get an order matching status (CURRENT or PURCHASED) and userid, include orderdetails
ordersRouter.get("/status/:status/:userid", async (req, res, next) => {
  console.log(
    "A request is being made to GET /orders/status/:status/:userid ..."
  );
  console.log("req.params : ", req.params);
  console.log("req.body : ", req.body);

  try {
    const userOrders = await getUserOrdersByStatus(
      req.params.status,
      parseInt(req.params.userid)
    );

    res.send({ userOrders });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders/:userid -
ordersRouter.post("/", async (req, res, next) => {
  console.log("A request is being made to POST /orders ...");
  console.log("req.params : ", req.params);
  console.log("req.body : ", req.body);

  let userid = req.body.userid;
  // if there is no userid passed in the req.body, then this is the guest user
  if (!userid) {
    let userObj = await getUserByUsername("guest99");
    if (!userObj?.id) {
      next(
        new Error({
          message: `Userid not provided, or not found in DB.  Valid userid should be provided.`,
        })
      );
      return;
    } else {
      userid = userObj.id;
    }
  } else {
    delete req.body.userid;
  }

  userid = parseInt(userid);
  let { productid, quantity, itemprice } = req.body;
  // if any of the parameters are missing, error out
  if (!productid || !quantity || !itemprice) {
    next(
      new Error({
        message: `Missing parameter(s): productid, quantity, itemprice.`,
      })
    );
    return;
  }
  productid = parseInt(productid);
  quantity = parseInt(quantity);

  try {
    let orderid = 0;
    // First, check to see if there is a CURRENT order for the current user
    let orderReturn = await getUserOrdersByStatus("CURRENT", userid);

    if (orderReturn.length > 0) {
      // IF there is a CURRENT order for this userid, set orderid from the returned array

      orderid = orderReturn[0].id;
      console.log("user has CURRENT order");
    } else {
      // ELSE create a new order, and set orderid based on the new order.id that was created
      orderReturn = await createOrder({ userid: userid });
      orderid = orderReturn.id;
      console.log("NEW order created");
    }
    console.log("orderid:", orderid);

    // orderid, productid, quantity, itemprice
    let newDetails = {
      orderid: orderid,
      productid: productid,
      quantity: quantity,
      itemprice: itemprice,
    };
    console.log("API adding > newDetails: ", newDetails);
    // try to create a new orderdetails record
    let orderDetail = await createOrderDetailItem(newDetails);
    // if the create fails (orderDetail is empty), it is because this item already exists in the CURRENT order
    if (!orderDetail) {
      console.log("orderDet not added");
      // so retrieve the current record from the DB
      orderDetail = await getOrderDetailsByIds(orderid, productid);
      console.log("orderDetail retrieved: ", orderDetail);
      if (orderDetail[0]?.quantity) {
        console.log("updating quantity");
        // update the quantity to be what the user wants to add, PLUS the number there already are
        newDetails.quantity += orderDetail[0].quantity;
      }
      // get the current product record
      const prodRecord = await getProductsById(productid);
      // check to see if the newQty that is going to be set is greater than the product.qtyavailable
      if (newDetails.quantity > prodRecord.qtyavailable) {
        orderDetail[0].message = "NOT_ENOUGH";
      } else {
        orderDetail = await updateOrderDetails(newDetails);
      }
    }

    if (orderDetail) {
      res.send({ orderDetail });
      return;
    } else {
      next(
        new Error({
          message: `DB ERROR: Unable to create orderdetails record.`,
        })
      );
    }
  } catch (error) {
    console.log("error:", error);
    next(error);
  }
});

// PATCH /api/orders/:orderid - change the specified orderid's order.status field from CURRENT to PURCHASED
//  return the updated order if successful
ordersRouter.patch("/:id", async (req, res, next) => {
  console.log("A request is being made to PATCH /orders/:id ... ");
  console.log("req.params : ", req.params);
  orderid = parseInt(req.params.id);

  try {
    const orderStatus = await getOrderStatusById(orderid);
    if (orderStatus?.status !== "CURRENT") {
      return next({ message: "Unable to change. Orderid is not CURRENT." });
    }

    const updatedOrder = await setCurrentOrderToPurchased(orderid);

    if (updatedOrder) {
      res.send({ updatedOrder });
    } else {
      return next({ message: "ERROR: orders update failed" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = ordersRouter;
