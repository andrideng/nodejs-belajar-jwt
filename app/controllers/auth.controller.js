const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // - code here
  const { username, email, password } = req.body;

  const payload = {
    username,
    email,
    password: bcrypt.hashSync(password, 8) 
  }
  const user = new User(payload);

  // callback
  user.save((err, user) => {
    // case error
    if (err) {
      return res.status(500).send({ message: err });
    }

    // case success dengan body roles dikirim
    const roles = req.body.roles;
    if (roles) {
      Role.find(
        {
          name: { $in: roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);

          // save user lagi
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err })
              return
            }

            return res.send({ message: "User was registered successfully!" });
          })
        }
      )
    }
    else {
      // jika roles tidak dikirim
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            return res.status(500).send({ message: err });
          }

          return res.send({ message: "User was registered successfully!" });
        });
      });
    }

   
  });


  // return res.send({ message: "User was registered successfully!" });
};

exports.signin = (req, res) => {
  // - code here
  const { username, password } = req.body;

  User.findOne({
    username
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if(err) {
        return res.status(500).send({ message: err }); 
      }

      if (!user) {
        return res.status(404).send({ message: 'user t idak ditemukan!' });
      }

      const passwordValid = bcrypt.compareSync(password, user.password);

      // - password invalid
      if (!passwordValid) {
        return res.status(401).send({
          access_token: null,
          message: 'invalid password!'
        })
      }

      const authorized = [];
      console.log(user)
      for (let i = 0; i < user.roles.length; i++) {
        authorized.push('ROLE_' + user.roles[i].name.toUpperCase());
      }


      // password valid
      const token = jwt.sign(
        { 
          id: user._id,
          username: user.username,
          email: user.email,
          roles: authorized
        },
        config.secret,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 3600 * 24 // 24 jam
        }
      );
      return res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorized,
        access_token: token
      });
    })

  // return res.status(200).send({
  //   id: 'user_id',
  //   username: 'tripleten.id',
  //   email: 'user@tripleten.id',
  //   roles: 'Admin',
  //   access_token: 'jwt-token'
  // });
};
