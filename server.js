require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifiyJwt = require("./middleware/verifyJwt");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

// connect to MongoDB
connectDB();

// 3 - custom middleware logger
app.use(logger);

// handle credentials CORS check
// add fetch cookies credentials requirement
app.use(credentials);

// credentials good - go to cors
app.use(cors(corsOptions));

// ! 1) built in middleware for forms
// example - form data
// "content-type: application/x-www-form-urlencoded"
// handling url-encoded data when form is submitted
app.use(express.urlencoded({ extended: false }));

// ! built-in middlewre for json
app.use(express.json());

// ! built-in middleware for cookies
app.use(cookieParser());

// ! serves static files from /public
//  default 1st arg is '/' - can be omitted
// app.use(express.static(path.join(__dirname, "/public")));
app.use("/", express.static(path.join(__dirname, "/public")));

// we're importing each router's router and defining a router for it
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// * ------------------------------------------
app.use(verifiyJwt);
// * everything bellow after this line will be protected!

app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not found" });
  } else res.type("txt").send("404 Not found");
});

// app.use('/')
// ! doesn't accept regex.. used for middleware
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");

  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});

// * NOTES

// ! Mongo db
// SQL databases - built in relational structure
// data is normalized

// ! JWT notes
// form of user id that is issued after auth happens - 1) access and 2) refresh token
// 1) usually 5-15 min
// 2) a day or up to few days (longer...)
// to avoid CSS and CSRF
// JSON data to be stored in memory (app state) - NOT IN LS

// 2) refresh token - http only cookie
// expiratino date
// 2) shouldn't be able to issue new refresh tokens (this would be forever access)

// 1) - issued at authorization
// user can then access protected routes
// verified with middleware (every request!)
// when expired - 2) is used to get a new 1)

// 2) - issued at authorization
// stored in db too - allows for early termination of 2).. i.e. on logout

// ! examples
// app.get(
//   // * define route
//   "/hello(.html)?",
//   // * route handlers
//   (req, res, next) => {
//     console.log("attempted to load hello.html");
//     next();
//   },
//   (req, res) => {
//     res.send("Hello World");
//   }
// );

// ! middleware looking functions
// const one = (req, res, next) => {
//   console.log("one");
//   next();
// };
// const two = (req, res, next) => {
//   console.log("two");
//   next();
// };
// const three = (req, res, next) => {
//   console.log("three");
//   res.send("finished!");
// };

// app.get("/chain(.html)?", [one, two, three]);

// ! accepts regex

// middleware types
// ! 1) built in m
// ! 2) custom m
// ! 3) 3rd party m
