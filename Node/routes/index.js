var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Welcome to the main page!');
});

// Serve Unity WebGL game files
router.use('/play/unity-game', express.static('public/GameBuild'));
/* Redirect from /play to /play/unity-game */
router.get('/play', function(req, res, next) {
  res.redirect('/play/unity-game');
});

// Serve Unity WebGL game files
router.use('/artest1/usear', express.static('public/AR'));
router.get('/artest1', function(req, res, next) {
  // res.redirect('/artest1/usear');
  res.redirect('https://howardchou.github.io/test1217_1/');
});

router.use('/artest2/usear', express.static('public/ARtest'));
router.get('/artest2', function(req, res, next) {
  // res.redirect('/artest2/usear');
});


// Serve Unity WebGL game files
router.use('/simpson/usear', express.static('public/Simpson'));
router.get('/simpson1', function(req, res, next) {
  // res.redirect('/simpson/usear');
  res.redirect('https://kevinlin1120.github.io/Simpson-s_Skate/');
});


module.exports = router;