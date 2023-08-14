// middleware functions that handle common authentication and authorization cases in routes of a web application.
// These middleware functions are used to ensure that users are properly authenticated and authorized to access certain routes 
//or perform certain actions.


"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

// authenticateJWT: This middleware handles JWT authentication. It checks the request's authorization header for a token.
// If one is present, the token is verified and the payload is stored on res.locals.user.
// If there is no token or if it is invalid, the next middleware is called.
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */
// ensureLoggedIn: This middleware ensures that a user is logged in. It checks if res.locals.user exists.
//If not, there will throw a error. If it does, the user is logged in and the next middleware is called.

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/*
 * Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.

*/
// ensureAdmin: This middleware ensures that the user is an admin. 
// It checks if res.locals.user exists and whether the isAdmin property is true. 
// If not, an UnauthorizedError is thrown. If it does, the user is an admin and the next middleware is called.

function ensureAdmin(req, res, next) {
  try {
    if (!res.locals.user || !res.locals.user.isAdmin) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */
// ensureCorrectUserOrAdmin: This middleware is used when a valid token and either the user or an admin privilege is required.
// It checks if the user is an admin or if the username in the URL parameter matches the username in the token.
// If neither is true, an UnauthorizedError is thrown. If one is true, the next middleware is called.

function ensureCorrectUserOrAdmin(req, res, next) {
  try {
    const user = res.locals.user;
    if (!(user && (user.isAdmin || user.username === req.params.username))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
};
