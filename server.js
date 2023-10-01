const express = require("express");
const app = express();
const path = require("path");

app.get("/", (req, res) => {
  res.send("hello");
});
// sending a file in express
app.get("^/$|/index(.html)?", (req, res) => {
  // express way
  // res.sendFile('./views/index.html',{root : __dirname})
  // the node way
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.get("/new-page(.html)?}", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});
// redirecting to a new page when routing from an old page
app.get("/old-page(.html)?}", (req, res) => {
  //for the web to know this is the new page
  res.redirect(301, "/new-page.html"); //302 by default
});
// Route handlers

// function chaining
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

// regular chaining as usually done
const one = (req, res, next) => {
    console.log('one')
    next()
}
const two = (req, res, next) => {
    console.log('two')
    next()
}
const three = (req, res, next) => {
    console.log('finished')
    res.send('done')
}

app.get('/chained(.html)?', [one,two,three])

// 404 page
app.get("/*", (req, res) => {
  // since it wont know the status code in this case we have to chain the status code to it
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
