require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const session = require("express-session");
const flash = require("connect-flash");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUnintialized: false, //false =>  must go to specific page to use session => generate session object
  })
);
app.use(flash());

/**
 * there problem with cookies.
 * 1. Cookies can only store a small amount of data(about 4KB).
 * 2. We cannot store important data, since it might be hacked on the way of transition
 * therefore, we come up with another tool, called sessions.
 */
app.get("/", (req, res) => {
  // console.log(req.session);
  // console.log(process.env.SECRET); // process is node.js global object, you can use dotenv to red .env property
  req.flash("successMsg", "login successfully");
  res.send(`Welcome to home page, ${req.flash("successMsg")}`);
});

/**
 * when put property into session, session will generate a connect.sid to browser cookies
 * when user send a request to server, server will inspect user's connect.sid.
 * once connect.sid is been verified, server can fetch according object in server storage
 * howerver, when the server is close, the storage will be cleared.
 */
app.get("/verify", (req, res) => {
  req.session.isVerified = true;
  console.log(req.session);
  res.send("You have been verified.");
});

app.get("/secret", (req, res) => {
  if (req.session.isVerified == true) {
    res.send("You got my secret.");
  } else {
    res.status(403).send("You are authorized to access this page ");
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something is broken. We will fix it soon.");
  next();
});

app.listen(3000, () => {
  console.log("server is running at port 3000.");
});
