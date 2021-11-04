const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = ( req, res, next ) => {
    //Get token from cookies
    const token = req.cookies['minesweeper-auth-token'];

    // Check if no token
    if( !token ) {
        return res.status(401).redirect('/minesweeper');
    }

    // Verify token
    try {
        const decoded = jwt.verify( token, config.get( 'jwtSecret' ) );
        if (decoded) {
            next();
        }
    } catch ( err ) {
        res.status( 401 ).json({ msg: 'Server error: token is not valid' });
    }
}