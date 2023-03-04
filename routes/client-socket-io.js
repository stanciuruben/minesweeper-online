const path = require('path');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// @route   GET
// @desc    socket.io client script
router.get('/', (req, res) => {
    res.sendFile( path.resolve( __dirname, '../node_modules/socket.io/client-dist/socket.io.min.js' ) );
});

module.exports = router;