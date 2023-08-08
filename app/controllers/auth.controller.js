const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // - code here

  return res.send({ message: "User was registered successfully!" });
};

exports.signin = (req, res) => {
  // - code here
  return res.status(200).send({
    id: 'user_id',
    username: 'tripleten.id',
    email: 'user@tripleten.id',
    roles: 'Admin',
    access_token: 'jwt-token'
  });
};
