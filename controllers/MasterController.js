"use strict";

module.exports = (app) => {
  let getUsers = async (req, res, next) => {
    var masterDb = await app.masterDb;
    let User = await masterDb.model("User");
    let userMod = await User.find({});
    if (!userMod) {
      return res.status(500).send({ error: true, result: "Internal Applicaiton error" });
    }
    res.status(200).send({ Users: userMod });
  };

  let getPosts = async (req, res, next) => {
    var masterDb = await app.masterDb;
    let User = await masterDb.model("User");
    let userMod = await User.find({});
    if (!userMod) {
      return res.status(500).send({ error: true, result: "Internal Applicaiton error" });
    }
    var posts = [];

    await Promise.all(
      await userMod.map(async (user) => {
        let userPosts = await getUserPost(user.id);
        console.log(userPosts);
        posts = [...posts, ...userPosts];
      })
    ).then(() => {
      res.status(200).send({ posts });
    });
  };

  let getUserPost = async (userid) => {
    var userDb = await app.userConnection.useDb("user" + userid);
    let Post = await userDb.model("Post");
    let posts = await Post.find({});
    return posts;
  };

  return { getUsers, getPosts };
};
