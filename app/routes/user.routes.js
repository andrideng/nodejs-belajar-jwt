const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // - api public (tanpa token)
  app.get("/api/test/all", controller.allAccess);

  // - api perlu token
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  // - api perlu token dan perlu role moderator  
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  // - api perlu token dan perlu role admin
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
