

const express = require('express')
const router = express.Router()
const path = require('path')


// instead of app.get we use router.get
// Define routes with string patterns
router.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, '..' , "views", "index.html"));
  });
  
  router.get("/test.html", (req, res) => {
    res.sendFile(path.join(__dirname,'..', "views", "subdir", "test.html"));
  });
  
// the way to export Router 
module.exports = router 