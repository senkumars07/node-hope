const bodyParser = require("body-parser");
const express = require("express");
const consign = require("consign");
var cnf = require("config");

const app = express();
app.cnf = cnf;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

consign().include("model/dbutil.js").then("middlewares").then("controllers").then("routes").into(app);

app.masterDb = app.model.dbutil.db.connect().useDb(app.cnf.get("app.db.master-db"));
app.userConnection = app.model.dbutil.db.connect("user");

module.exports = app;
