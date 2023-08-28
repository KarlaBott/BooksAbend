const express = require("express");
const orderdetailsRouter = express.Router();

const {
  deleteOrderDetails,
  getAllOrderDetails,
  getOrderDetailsByIds,
  getOrderStatusById,
  updateOrderDetails,
} = require("../db");

orderdetailsRouter.use((req, res, next) => {
  console.log(
    "A request is being made to /api/orderdetails - next() is called ..."
  );
  next();
});

// GET /api/orderdetails - Return a list of all orderdetails
orderdetailsRouter.get("/", async (req, res, next) => {
  console.log("A request is being made to GET /api/orderdetails ...");
  // console.log("req.body is ", req.body);
  try {
    const orderdetails = await getAllOrderDetails();
    res.send({ orderdetails });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/orderdetails/:orderid/:productid
//  remove the specified orderdetails records.  Must be associated with an order that is order.status='CURRENT'
orderdetailsRouter.delete("/:orderid/:productid", async (req, res, next) => {
  console.log("A request is being made to DELETE /orderdetails ...");
  console.log("req.params : ", req.params);
  let orderid = parseInt(req.params.orderid);
  let productid = parseInt(req.params.productid);

  try {
    const deletedItem = await getOrderDetailsByIds(orderid, productid);

    if (!deletedItem || deletedItem.length < 1) {
      return next({ message: "Unable to find orderdetail record to delete" });
    }

    let orderStatus = await getOrderStatusById(orderid);
    if (orderStatus?.status !== "CURRENT") {
      return next({ message: "Unable to delete. Orderid is not CURRENT." });
    }

    await deleteOrderDetails(orderid, productid);

    res.send({
      message: "OrderDetails record successfully deleted!",
      ...deletedItem,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/orderdetails/:orderid/:productid - Update the quantity or itemprice of orderdetails record
//  update the specified orderdetails records.  Must be associated with an order that is order.status='CURRENT'
orderdetailsRouter.patch("/:orderid/:productid", async (req, res, next) => {
  console.log(
    "A request is being made to PATCH /orderdetails/:orderid/:productid ... "
  );
  console.log("req.params : ", req.params);
  console.log("req.body : ", req.body);

  const { quantity, itemprice } = req.body;
  const updateFields = {};
  updateFields.orderid = parseInt(req.params.orderid);
  updateFields.productid = parseInt(req.params.productid);

  if (quantity) {
    updateFields.quantity = parseInt(quantity);
  }
  if (itemprice) {
    updateFields.itemprice = itemprice;
  }

  try {
    const originalItem = await getOrderDetailsByIds(
      updateFields.orderid,
      updateFields.productid
    );

    if (!originalItem || originalItem.length < 1) {
      return next({ message: "Unable find orderdetails record to update" });
    }

    let orderStatus = await getOrderStatusById(updateFields.orderid);
    if (orderStatus?.status !== "CURRENT") {
      return next({ message: "Unable to change. Orderid is not CURRENT." });
    }

    const updatedODrecord = await updateOrderDetails(updateFields);

    if (updatedODrecord) {
      res.send({ updatedODrecord });
    } else {
      return next({ message: "ERROR: orderdetails update failed" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = orderdetailsRouter;
