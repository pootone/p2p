var express = require('express');
var router = express.Router();
var path = require('path');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // const filePath = __dirname + '/../public/HTML/badge.html';
  // res.sendFile(filePath);

  res.sendFile(path.join(__dirname, 'html/aboutUs.html'));
});

module.exports = router;
