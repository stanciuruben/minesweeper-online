const path = require('path');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// @route   GET
// @desc    Minesweeper game
// @access  Private
router.get('/', auth, (req, res) => {
    res.sendFile( path.resolve( __dirname, '../game/game.html' ) );
});

module.exports = router;