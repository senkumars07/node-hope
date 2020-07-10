const mongoose = require("mongoose");
var cnf = require("config");

const clientOption = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30000,
  poolSize: 50,
  useNewUrlParser: true,
  autoIndex: false,
};
const option = { useNewUrlParser: true };

const initDbConnection = (type = "master") => {
  let db = mongoose.createConnection(cnf.get("app.db.master-atlas"), clientOption);

  db.on("error", console.error.bind(console, "MongoDB Connection Error>> : "));
  db.once("open", function () {
    console.log(`${type} MongoDB Connection ok!`);
  });
  require("./user.js");
  if (type == "user") require("./post.js");
  return db;
};

module.exports = {
  db: {
    connect: initDbConnection,
  },
};
