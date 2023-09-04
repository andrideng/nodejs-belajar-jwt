const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  // middleware global route scope
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // api untuk signup / register
  app.post(
    "/api/auth/signup",
    // middleware specific
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    // controller
    controller.signup
  );

  // api untk login
  app.post("/api/auth/signin", controller.signin);
};
