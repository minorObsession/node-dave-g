const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3500;

// 3 - custom middleware logger
app.use(logger);

app.use(cors(corsOptions));

// 1) built in m
// example - form data
// "content-type: application/x-www-form-urlencoded"
// handling url-encoded data.. when form is submitted
app.use(express.urlencoded({ extended: false }));

// built-in middlewre for json
app.use(express.json());

// ! default 1st arg is '/' - can be omitted
// app.use(express.static(path.join(__dirname, "/public")));
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
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

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

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
