const express = require("express");
const app = express();
const ejs = require("ejs");
const cookieParser = require("cookie-parser");

app.use(express.static("public"));
app.use(cookieParser(process.env.SECRET)); // the string will be used for signing cookies
app.set("view engine", "ejs");

/**
 * cookies are some information we can store in user's browser
 * cookies are mainly for reading server-side only, whereas localStorage and SessionStorage canonly read by client side
 * when we sending HTTP request, cookies are part of the request, whereas storage is not.
 * cookies are stored in k-v pair
 */
app.get("/", (req, res) => {
  //   res.render("index.ejs");
  let { name } = req.cookies; // get name for cookies.
  let { address } = req.signedCookies; // get name for signedCookies.
  //   res.cookie("name", "Jason");// set cookie to response object
  res.send(`Welcome ${name} to home page.  ${address}`);
});

/**
 * when you response a cookies in browser, user can change cookies context!!!!!
 * need to sign the cookies value (Not encryption ), before response
 */
app.get("/getSigningCookies", (req, res) => {
  res.cookie("address", "Hawaii St.", { signed: true });
  res.send("Cookies has been send.");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something is broken. We will fix it soon.");
  next();
});

app.listen(3000, () => {
  console.log("server is running at port 3000.");
});
