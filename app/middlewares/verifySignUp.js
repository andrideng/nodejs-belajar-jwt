const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  const { username, email } = req.body;

  // - code here
  User.findOne({
    username
  })
  .exec((err, user) => {
    if (err) {
      return res.status(500).send({
        message: err
      })
    }

    if (user) {
      return res.status(400).send({
        message: 'Gagal! Username sudah terdaftar!'
      })
    }

    // check email
    User.findOne({
      email
    })
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({
          message: err
        })
      }

      if (user) {
        return res.status(400).send({
          message: 'Gagal! Email sudah terdaftar!'
        })
      }

      next();
    })
  });

  // next();
};

checkRolesExisted = (req, res, next) => {
  // - code here
  // admin, user, moderator

  const { roles } = req.body;

  if (roles) {
    for(let i = 0; i < roles.length; i++) {
      const role = roles[i];
      if (!ROLES.includes(role)) {
        return res.status(400).send({
          message: `Gagal! Role ${role} tidak valid!`
        })
      }

      next();
    }
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
