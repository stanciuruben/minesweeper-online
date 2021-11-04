const path = require('path');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   GET
// @desc    login.html
// @access  Public
router.get('/', async ( req, res ) => {
    res.sendFile( path.resolve( __dirname, '../pages/login.html' ) );
});

// @route   POST
// @desc    log-in user
// @access  Public
router.post('/', async ( req, res ) => {
    const { email, password } = req.body;
    const errors = [ 'Invalid Credetials' ];

    try {
        const user = await User.findOne({ email });
        if ( user === null ) {
            return res.json({ errors });
        }

        const isMatch = await bcrypt.compare( password, user.password );
        if ( !isMatch ) {
            return res.json({ errors });
        }

        // return JWT
        const payload = {
            user: {
                iat: Date.now() / 1000,
                id: user.id
            }
        }

        jwt.sign( 
            payload,
            config.get( 'jwtSecret' ),
            { expiresIn: 3600 },
            ( err, token ) => {
                if ( err ) throw err;
                return res.json({ token });
            }
        );
    } catch ( error ) {
        console.error( error.message );
        res.status( 500 ).send( 'Server error' );
    }
});

module.exports = router;