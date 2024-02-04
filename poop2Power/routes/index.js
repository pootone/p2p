var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'html/index.html'));
});

router.get('/trans', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'html/indexTrans.html'));
});

module.exports = router;
