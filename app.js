//jshint esversion:6
const mongoose = require("mongoose"); //backend for mongodb
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
var sid = "AC4818444fcf353850ab8b0f6edcfa90cb";
var auth_token = "e93256812c5783e6cfabb1f506477062";
var phone = "+16626667521";
const client = require("twilio")(sid, auth_token);
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const sms = require("fast-two-sms");

require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  age: Number,
  address: String,
  state: String,
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/hackathonDB");

app.get("/", function (req, res) {
  res.render("login");
});

app.get("/registration", function (req, res) {
  res.render("registration");
});

app.get("/home", function (req, res) {
  res.render("home");
});

app.get("/messaging", function (req, res) {
  res.render("messaging");
});

app.post("/", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);
  User.findOne({ username: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        console.log(foundUser);
        if (foundUser.password === password) {
          res.render("messaging");
        }
      }
    }
  });
});

app.post("/messaging", async function (req, res) {
  const number = req.body.phone;
  const message = req.body.message;
  client.messages
    .create({
      body: message,
      to: ["+919309911264"],
      from: phone,
    })
    .then((message) => console.log(message.sid))
    .catch((err) => console.log(err));
});

app.post("/registration", function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const address = req.body.address;
  const state = req.body.state;

  const user = new User({
    name: name,
    email: email,
    username: username,
    phone: req.body.number[1],
    age: req.body.number[0],
    address: address,
    state: state,
    password: password,
  });

  user.save(function (err) {
    if (!err) {
      res.render("login");
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = "3000";
}

app.listen(port, function () {
  console.log("Server has started sucessfully");
});
