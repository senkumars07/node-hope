"use strict";
var axios = require("./utils/axios.js");
var cnf = require("config");
var md5 = require("md5");
var { db } = require("./model/dbutil.js");
var masterConnection = db.connect();
var userConnection = db.connect("user");

const args = process.argv.slice(2);

if (typeof args[0] === "undefined") {
  console.log("Invalid process Type");
  process.exit();
}

if (args[0] != "users" && args[0] != "posts") {
  console.log("Invalid process Type, must be ['users','posts']");
  process.exit();
}

// Process users CLI
if (args[0] == "users") {
  axios
    .get(cnf.get("app.cli-source.users"))
    .then((response) => {
      processUsers(response.data);
    })
    .catch((err) => {
      console.dir(err);
    });
}

// Process Posts CLI
if (args[0] == "posts") {
  let posts = axios
    .get(cnf.get("app.cli-source.posts"))
    .then((response) => response.data)
    .catch((err) => console.dir(err));

  let comments = axios
    .get(cnf.get("app.cli-source.comments"))
    .then((response) => response.data)
    .catch((err) => console.dir(err));

  Promise.all([posts, comments]).then(async (res) => {
    let comments = [];
    res[1].forEach((comment) => {
      if (!comments[comment.postId]) comments[comment.postId] = [];
      comments[comment.postId].push({
        name: comment.name,
        email: comment.email,
        body: comment.body,
      });
    });
    await processPost(res[0], comments);
  });
}

// save the users into user collection
let processUsers = async (users) => {
  let userLimit = 0;
  await Promise.all(
    await users.map(async (user) => {
      userLimit++;
      if (userLimit > cnf.get("app.cli-source.user-limit")) {
        return true;
      }
      let userObj = {
        id: user.id,
        username: user.username,
        password: md5("password"),
        email: user.email,
        profilePic: "",
      };
      let masterDb = await masterConnection.useDb(cnf.get('app.db.master-db'));
      let User = await masterDb.model("User");
      let userPresent = await User.findOne({
        id: user.id,
      });
      if (!userPresent) {
        await new User(userObj).save();
        console.dir(`User : ${user.username} saved successfully!`);
      } else {
        console.dir(`User : ${user.username} Alreay Exist!`);
      }
    })
  ).then(() => process.exit());
};

let processPost = async (posts, comments) => {
  let masterDb = await masterConnection.useDb("master");
  let User = await masterDb.model("User");
  let users = [];
  (await User.find({}).select("id -_id")).forEach((usr) => {
    users.push(usr._doc.id);
  });
  await posts.forEach(async (post) => {
    if (!users.includes(post.userId)) return false;
    let postObj = {
      id: post.id,
      title: post.title,
      body: post.body,
      comments: comments[post.id],
    };
    let userDb = await userConnection.useDb("user" + post.userId);
    let Post = await userDb.model("Post");
    let postPresent = await Post.findOne({
      id: post.id,
    });
    if (!postPresent) {
      await new Post(postObj).save();
      console.dir(`User Id : ${post.userId}, Post Id : ${post.id} saved successfully!`);
    } else {
      console.dir(`User Id : ${post.userId},Post Id : ${post.id} Alreay Exist!`);
    }
  });
};
