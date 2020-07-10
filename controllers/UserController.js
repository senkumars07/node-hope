"use strict";
var md5 = require("md5");

module.exports = (app) => {
  var { auth } = app.middlewares
  

  let login = async (req, res, next) => {
    try{req.body = JSON.parse(Object.keys(req.body)[0])}catch(err){req.body = req.body}
    var masterDb  = await app.masterDb;
    let User = await masterDb.model("User");
    let userMod = await User.findOne({
      username: req.body.username,
      password: md5(req.body.password)
    });
    if (!userMod) {
        return res.status(401).send({ error: true, result: "Invalid access! Username/password not match"});
    }
    // res.status(200).send({ userMod });
    let user = { id: userMod.id, role: userMod.role };
    let token = auth.generateAccessToken(user);
    res.status(200).send({ authToken: token });
  };

  let getUsersInfo = async (req, res, next) => {
    var masterDb  = await app.masterDb;
    let User = await masterDb.model("User");
    let userMod = await User.findOne({
      id: req.user.id
    });
    if (!userMod) {
        return res.status(500).send({ error: true, result: "Internal Applicaiton error"});
    }
    res.status(200).send({ UserInfo: userMod });
  };

  let getPosts = async (req, res, next) => {
    var userDb  = await app.userConnection.useDb("user"+req.user.id);
    let Post = await userDb.model("Post");
    let posts = await Post.find({});
    res.status(200).send({ posts });
  };

  return { login, getUsersInfo, getPosts };
};
