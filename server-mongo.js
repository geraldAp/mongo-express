require('dotenv').config();

// Now you can access process.env.MONGO_URI

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

// importing log events function
const { logger } = require("./middleware/logEvents");
const errorhandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOption");
const connectDb = require("./config/dbCon");
const mongoose = require("mongoose");

// connect to db
connectDb();

// MiddleWares
//handle options credentials check - before CORS!
// fetch cookies credentials requirement
app.use(credentials);

// custom middle ware logger
app.use(logger);
// built in middle ware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh")); //this will issue a new route
app.use("/logout", require("./routes/logout"));
app.use(verifyJWT); //everything after this line will use the verify jwt middleware
app.use("/employees", require("./routes/api/employees"));

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

app.use(errorhandler);

//  since we don't want to listen for requests if mongoose doesn't connect so we do this we used once since we will listen to this only once. now we only listen to events if we have connected.
mongoose.connection.once('open', ()=>{
  console.log('Connected to MongoDb')
  const PORT = process.env.PORT || 3500;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
