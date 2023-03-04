const Logic = require('./logic');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const onSocketConnection = async socket => {
    console.log('socket connected');
    const token = socket.handshake.headers.token;
    if ( !token ) {
        socket.disconnect();
    }

    const jwtData = jwt.decode( token );
    const isJwtExpired = () => {
        if ( Date.now() >= jwtData.exp * 1000 ) {
            socket.disconnect();
        }
    }

    let currentScore = 0,
        currentMineField = [],
        currentBombIds = [],
        currentUncoveredCells = [];

    // If unfinished game is saved on database
    const user = await User.findById( jwtData.user.id );
    const score = user.score;
    if ( user.game.length > 0 ) {
        currentScore = user.gameScore;
        currentMineField = JSON.parse( JSON.stringify( user.game ) );
        currentBombIds = JSON.parse( JSON.stringify( user.bombIds ) );
        currentUncoveredCells = JSON.parse( JSON.stringify( user.uncoveredCells ) );
    }

    const resetDatabase = async () => {
        await User.findByIdAndUpdate( 
            jwtData.user.id, 
            { 
                gameScore: 0,
                game: [],
                bombIds: [],
                uncoveredCells: []
            } 
        );
    }

    const createNewGame = async ( size, difficulty ) => {
        isJwtExpired();

        const mineField = Array( size ).fill().map(
            () => Array( size ).fill().map( 
            () => { return { value: 0, uncovered: false } } )
        );
        currentBombIds = JSON.parse( JSON.stringify(
            Logic.addBombs( size, difficulty, mineField )
        ) );
        currentUncoveredCells = [];
        currentScore = 0;
        // Deep save on server
        currentMineField = JSON.parse( JSON.stringify( mineField ) );
        // Reset gameScore in database and on client
        await User.findByIdAndUpdate( jwtData.user.id, { gameScore: 0 } );
        socket.emit( 'reset-score' );
    }

    const loadGame = () => {
        console.log('server receives load-game');
        isJwtExpired();

        let size = currentMineField.reduce( (size, element) => size + 1, 0);
        if ( size > 0) {
            socket.emit( 'load-game', size );
            socket.emit( 'uncover-cells', currentUncoveredCells );
            console.log('server emits load-game');
            return;
        }
        socket.emit( 'no-game' );
        socket.emit( 'reset-score' );
        console.log('server emits no-game');
    }

    const uncoverCell = async ( x, y, size ) => {
        isJwtExpired();

        const socketResponse = Logic.uncoverCell( x, y, currentMineField, size );
        if ( socketResponse.gameLost ) {
            await resetDatabase();
            socket.emit( 'game-lost', currentBombIds );
            return;
        }
        
        if ( socketResponse.uncoveredCells ) {
            currentUncoveredCells.push( ...socketResponse.uncoveredCells );
            socket.emit( 'uncover-cells', socketResponse.uncoveredCells );
            currentScore += socketResponse.score;
            socket.emit( 'update-score', socketResponse.score );
            if ( Logic.isGameWon( currentUncoveredCells.length, size, currentBombIds.length ) ) {
                await resetDatabase();
                await User.findByIdAndUpdate( jwtData.user.id, { score: score + currentScore } );
                socket.emit( 'game-won', currentBombIds );
                return;
            }
            await User.findByIdAndUpdate( jwtData.user.id, { gameScore: currentScore } );
        }
    }

    const saveProgress = async () => {
        await User.findByIdAndUpdate(
            jwtData.user.id, 
            {
                gameScore: currentScore,
                game: currentMineField,
                bombIds: currentBombIds,
                uncoveredCells: currentUncoveredCells
            } 
        );
    }

    // Send user info to client 
    socket.emit( 'user-info', user.name, user.score, user.gameScore );
    
    socket.on( 'create-new-game', ( size, difficulty ) => { createNewGame( size, difficulty ) });
    socket.on( 'load-game', loadGame );
    socket.on( 'uncover-cell', ( x, y, size ) => { uncoverCell( x, y, size ) });
    socket.on( 'save-progress',  saveProgress );
}

module.exports = onSocketConnection;