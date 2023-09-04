const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  // - code here

  // - capture header authorization
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(403)
      .send({
        message: 'Tolong Pass token!'
      })
  }
  token = token.slice(7);

  // - verify token
  jwt.verify(
    token,
    config.secret,
    (err, decoded) => {
      // -jika error
      if (err) {
        return res.status(401)
          .send({
            message: 'Token dikenali sistem kami!'
          })
      }

      // - success
      console.log(decoded);
      req.userId = decoded.id;
      req.roles = decoded.roles;
      next();
    }
  )

  next();
};

isAdmin = (req, res, next) => {
  // - code here
  const { roles } = req;
  if (roles.indexOf('ROLE_ADMIN') === -1) {
    return res.status(403).send({
      message: 'Tolong login sebagai admin'
    })
  }
};

isModerator = (req, res, next) => {
  // - code here
  const { userId, roles } = req;
  console.log(roles);

  // case nout found
  if (roles.indexOf('ROLE_MODERATOR') === -1) {
    return res.status(403).send({
      message: 'Tolong login sebagai moderator!'
    })
  }
  next()
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;
