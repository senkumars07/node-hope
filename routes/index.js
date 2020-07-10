module.exports = (app) => {
  // console.dir(app);

  //Middleware
  let { auth } = app.middlewares;

  // Controllers
  let MasterController = app.controllers.MasterController;
  let UserController = app.controllers.UserController;

  app.get("/api/health", (req, res, next) => {
    res.status(200).send({ success: true });
  });

  // Users Controller routes
  app.post("/api/auth", (req, res, next) => {
    UserController.login(req, res, next);
  });

  app.get("/api/users", auth.authenticateToken, (req, res, next) => {
    UserController.getUsersInfo(req, res, next);
  });

  app.get("/api/posts",auth.authenticateToken, (req, res, next) => {
    UserController.getPosts(req, res, next);
  });

  // Master Controller routes
  app.get("/api/admin/users",[auth.authenticateToken,auth.hasAdminAccess], (req, res, next) => {
    MasterController.getUsers(req, res, next);
  });

  app.get("/api/admin/posts",[auth.authenticateToken,auth.hasAdminAccess], (req, res, next) => {
    MasterController.getPosts(req, res, next);
  });
};
