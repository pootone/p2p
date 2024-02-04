var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'HTML/indexS1.html'));
});

router.get('/trans', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'HTML/indexTrans.html'));
});

module.exports = router;
