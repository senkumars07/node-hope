module.exports = (app) => {
  // Authentication middleware
  const jwt = require("jsonwebtoken");

  let authenticateToken  = (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).send({ error: true, result: "Unauthorized access", status: 401 });
    jwt.verify(token, JSON.stringify(app.cnf.get("app.secure.token")), (err, user) => {
      console.log(err);
      if (err) return res.status(401).send({ error: true, result: "Unauthorized access", status: 401 });
      req.user = user;
      next(); // pass the execution off to whatever request the client intended
    });
  }

  let hasAdminAccess = (req, res, next) => {
    console.log(req.user.role)
    let role = req.user && req.user.role 
    if(role != "admin") 
        res.status(401).send({ error: true, result: "Unauthorized access! Request only by admin", status: 401 });
    next(); // pass the execution off to whatever request the client intended
  }

  let generateAccessToken = (user) => {
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign(user, JSON.stringify(app.cnf.get("app.secure.token")), { expiresIn: '1800s' });
  }

  return {authenticateToken,hasAdminAccess,generateAccessToken};
};
