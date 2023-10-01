// basically cleaner version much arranged and easier to manage 
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");// importing log events function
const errorhandler = require("./middleware/errorHandler");
const corsOptions = require('./config/corsOption')

// MiddleWares
app.use(cors(corsOptions));
app.use(logger);// custom middle ware logger
// built in middle ware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use('/employees', require('./routes/api/employees'))

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
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
