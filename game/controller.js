"use strict";

var Socket = io(
    'https://46.41.148.88',
    {
        path: '/minesweeper',
        rejectUnauthorized: false,
        extraHeaders: {
            token: document.cookie.split( "=" )[ 1 ]
        }
    }
);

var Controller = ( function( View, Socket ) {
    var DomElements = View.getDomElements(),
        size = {
            options: [15, 20, 25],
            index: 0,
        },
        difficulty = {
            options: [ "easy", "medium", "hard" ],
            index: 0,
        };

    function getIdCoordinates( id ) {
        return {
                x: parseInt( id.split( "-" )[ 0 ] ),
                y: parseInt( id.split( "-" )[ 1 ] )
        }
    }
    
    function getIdFromCoordinates( coordinates ) {
        return `${ coordinates.x }-${ coordinates.y }`;
    }

    // Socket emiters and receivers
    function loadGame() {
        Socket.emit( "load-game" );
        console.log('client emits load-game');
    }

    Socket.on( "load-game", function( size )  {
        createNewgame( size );
        loadCellEvents();
        View.display( "game" );
        console.log('client receives load-game');
    });

    Socket.on( "no-game", function()  {
        View.display( "menu" );
        console.log('client receives no-game');
    });

    Socket.on( "game-lost", function( bombIds )  {
        View.gameOver( bombIds );
        View.displayFinalStatus( false );
    });

    Socket.on( "game-won", function( bombIds )  {
        View.gameWon( bombIds );
        View.displayFinalStatus( true );
    });

    Socket.on( "uncover-cells", function( cellsToUncover )  {
        for( var i = 0; i < cellsToUncover.length; ++i ) {
            var id = getIdFromCoordinates( cellsToUncover[ i ] );
            View.uncoverCell( id, cellsToUncover[ i ].value );
        }
    });

    Socket.on( "user-info", function( username, score, gameScore ) {
        DomElements.userName.innerText = "Username: " + username;
        DomElements.gameScore.innerText = "Game Score: " + gameScore;
        DomElements.totalScore.innerText = "Total Score: " + score;
    });

    Socket.on( "update-score", function( score ) {
        DomElements.gameScore.innerText = `Game Score: ${ score + parseInt( DomElements.gameScore.innerHTML.split( " " )[2] ) }`;
        DomElements.totalScore.innerText = `Total Score: ${ score + parseInt( DomElements.totalScore.innerHTML.split( " " )[2] ) }`;
    });

    Socket.on( "reset-score", function( score ) {
        DomElements.gameScore.innerText = "Game Score: 0";
    });

    Socket.on( "disconnect", function()  {
        window.location.replace('/minesweeper');
    });

    Socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err}`);
    });

    // Switch between values in menu based on sizes and difficulty object declared above
    function onMenuClick( evnt ) {
        var id = evnt.target.id,
            buttonDirection = id.split( "-" )[ 2 ],
            buttonField = id.split( "-" )[ 0 ];
        switch (buttonDirection) {
            case "prev":
                if ( eval( buttonField ).index > 0 ) {
                    --eval( buttonField ).index;
                }
                break;
            case "next":
                if ( eval( buttonField ).index < eval( buttonField ).options.length - 1 ) {
                    ++eval( buttonField ).index;
                }
                break;
        }
        View.updateMenu(
            buttonField, 
            eval( buttonField ).options[ eval( buttonField ).index ]
        );
    }

    function onCellClick( evnt ) {
        var id = getIdCoordinates( evnt.target.id );
        Socket.emit( "uncover-cell",  id.x, id.y, size.options[ size.index ] );
    }

    function onCellRightClick( evnt ) {
        evnt.preventDefault();
        View.toggleFlag( evnt.target.id );
    }

    function loadCellEvents() {
        var cells = document.getElementsByClassName( "cell-hidden" );
        for ( var i = 0; i < cells.length; ++i ) {
            cells[ i ].addEventListener( "click", onCellClick );
            cells[ i ].addEventListener( "contextmenu", onCellRightClick );
        }
        DomElements.saveButton.addEventListener( "click", function() { Socket.emit( "save-progress" ) } );
    }

    function createNewgame( gameSize ) {
        View.createNewMineField( gameSize );
    }

    function onStart() {
        View.display( "loading" );

        var gameSize = size.options[ size.index ];
        var gameDifficulty = difficulty.options[ difficulty.index ];
        DomElements.mineField.innerHTML = "";

        Socket.emit( "create-new-game", gameSize, gameDifficulty );
        createNewgame( gameSize );

        loadCellEvents();
        View.display( "game" );
    }

    function onRetrun() {
        View.removeFinalStatus();
        View.display( "menu" );
    }

    function loadMenuEvents() {
        for ( var i = 0; i < DomElements.menuButtons.length; ++i ) {
            DomElements.menuButtons[i].addEventListener( "click", onMenuClick );
        }
        DomElements.startButton.addEventListener( "click", onStart );
        DomElements.returnButton.addEventListener( "click", onRetrun );
    }

    return {
        onLoad: function() {
            View.removeFinalStatus();
            loadMenuEvents();
            View.displayApp();
            View.display( "loading" );
            // Give some time to Socket.io to connect to the server
            setTimeout( loadGame, 3000);
            console.log('loading');
        }
    }
})( View, Socket );

Controller.onLoad();