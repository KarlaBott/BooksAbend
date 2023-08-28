const apiRouter = require("express").Router();
const {authenticateWithoutToken} = require('./adminAccess')

apiRouter.use(authenticateWithoutToken)
apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!",
  });
});

apiRouter.get("/health", (req, res, next) => {
  res.send({
    healthy: true,
  });
});


// place your routers here

// ROUTER: /api/users
const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

// ROUTER: /api/products
const productsRouter = require("./products");
apiRouter.use("/products", productsRouter);

// ROUTER: /api/orders
const ordersRouter = require("./orders");
apiRouter.use("/orders", ordersRouter);

// ROUTER: /api/orderdetails
const orderdetailsRouter = require("./orderdetails");
apiRouter.use("/orderdetails", orderdetailsRouter);

// API/<routers> defined above here.  "apiRouter" is the parent router for all of these.
// Now any time middleware that the router is the parent router for, calls next with an object (rather than just next()),
// we will skip straight to the error handling middleware and send back the object to the front-end.
apiRouter.use((error, req, res, next) => {
  res.send({
    // name: error.name,
    message: error.message,
  });
});

module.exports = apiRouter;
