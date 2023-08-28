const bcrypt = require('bcrypt');
const { getUserByUsername } = require('../db/models/user');
// This authentication designed to work without requiring JWT or other tokens, using the user's username and password directly.
// Function starts by extracting the "Authorization" header from the request headers.
// If the "Authorization" header is present, the code splits it into two parts: the authentication type (e.g., "Basic") and the actual token (which is usually the base64-encoded username and password combination).
// The code decodes the base64-encoded token if the authentication type is "Basic" and a token is provided.
// Then it fetches getUserByUsername function
// If User is found it proceeds to check the validity of password and username(crypt.compare).

const authenticateWithoutToken = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    // No authentication header, continue to the next.
    return next();
  }

  const [authType, token] = authHeader.split(' ');

  if (authType !== 'Basic' || !token) {
    return next({
      name: 'AuthorizationHeaderError',
      message: 'Authorization must be provided',
    });
  }

  const credentials = Buffer.from(token, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  try {
    const user = await getUserByUsername(username);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        req.user = user;
      }
    }
  } catch (error) {
    return next(error);
  }

  next();
};

const adminAccess = (req, res, next) => {
  if (req.user.isadmin) {
    return next(); 
  }
  return res.status(403).json({ message: "Access denied" });
};
  
const requireUser = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action"
    });
  }

  next();
}



module.exports = {
  adminAccess,
  requireUser,
  authenticateWithoutToken,
};