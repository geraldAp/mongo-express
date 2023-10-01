const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
// importing log events function
const { logger } = require("./middleware/logEvents");
const errorhandler = require("./middleware/errorHandler");
// MiddleWares
// third party middleware
// for cross origin resource sharing

// app.use(cors());  //atm without creating a white list this is open to the public
// basically these are the only domains that can access your backend
const whitelist = [
  "https://www.google.com",
  "http:/localhost:3500",
  "http://127.0.0.1:5550",
];
// the function that will allow cors only give access to your backend data to the whitelisted site
const corsOptions = {
  // first thing in this object is the origin which can take a function an anonymous function and a callback function the origin is this function is the origin from which the data was requested or whoever requested it the no origin is done because of development purposes
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by Cors"));
    }
  },
  // second option
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// nb: custom middlewares require the next call
// custom middle ware logger
app.use(logger);

// built in middle ware
app.use(express.urlencoded({ extended: false })); // this middle ware here is used for handling url encoded data in other words, form data so this allows us to access data from forms simply if the data is submitted
app.use(express.json()); // to be able to access json data
// to serve static files like images, css, js, etc.
app.use(express.static(path.join(__dirname, "public")));

// sending a file in express
app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.get("/new-page(.html)?}", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});
app.get("/old-page(.html)?}", (req, res) => {
  res.redirect(301, "/new-page.html");
});
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to access hello world");
    next();
  },
  (req, res) => {
    res.send("hello world");
  }
);
const one = (req, res, next) => {
  console.log("one");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res, next) => {
  console.log("finished");
  res.send("done");
};
app.get("/chained(.html)?", [one, two, three]);
// using app.all for all http request this is used over app.use for a route middleware like this since it applies to all requests

app.all("*", (req, res) => {
  //customizing the 404
  res.status(404);
  //   checking the type
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});
// custom error handling
app.use(errorhandler);
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
