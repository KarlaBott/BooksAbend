const express = require("express");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");



const {
  createUser,
  getAllUsers,
  getUserByUsername,
  updateCurrentGuestOrderForExistingUser,
  updateCurrentGuestOrderForNewUser,
} = require("../db");


const {requireUser} = require('./adminAccess')


usersRouter.use((req, res, next) => {
  console.log("A request is being made to /api/users - next() is called ...");
  next();
});

// GET /api/users - Return a list of all users
usersRouter.get("/", async (req, res, next) => {
  console.log("A request is being made to GET /api/users ...");
  // console.log("req.body is ", req.body);
  try {
    const users = await getAllUsers();
    res.send({ users });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password, useremail } = req.body;

  try {
    const isadmin = false;
    const _user = await getUserByUsername(username);

    if (_user) {
      return next({
        message: `User ${username} is already taken.`,
        name: "UserTakenError",
        error: "UserTakenError",
      });
    }

    const user = await createUser({
      username,
      useremail,
      password,
      isadmin,
    });

    await updateCurrentGuestOrderForNewUser(user.id);

    res.send({
      message: "REGISTRATION SUCCESSFUL!  Thank you for signing up",
      user: {
        userid: user.id,
        username: user.username,
        useremail: user.useremail,
      },
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  try {
    const user = await getUserByUsername(req.body.username);

    if (!user) {
      return next({
        message: "That user does not exist, please try another username.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return next({
        message:
          "ERROR:  password does not match. Please check your information and try again.",
      });
    }

    delete user.password;
    delete user.isadmin;

    await updateCurrentGuestOrderForExistingUser(user.id);
    console.log(user);
    res.send({ user, message: "SUCCESSFULLY logged in!" });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/me
usersRouter.get('/me', async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error)
  }
})


module.exports = usersRouter;
