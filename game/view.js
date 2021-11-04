"usestrict";

var View = ( function() {
    // DOM ELEMENTS
    var app = document.getElementById( "app-container" ),
        loadingScreen = document.getElementById( "loading-screen" ),
        gameMenu = document.getElementById( "game-menu" ),
        finalStatus = document.getElementById( "game-final-status" ),
        finalMessage = document.getElementById( "game-final-status--message" ),
        mineField = document.getElementById( "mine-field" ),
        sizeValue = document.getElementById( "size-value" ),
        difficultyValue = document.getElementById( "difficulty-value" ),
        userName = document.getElementById( "user-name" ),
        gameScore = document.getElementById( "user-score" ),
        totalScore = document.getElementById( "user-total-score" ),
        menuButtons = document.getElementsByClassName( "option" ),
        startButton = document.getElementById( "start-button" ),
        returnButton = document.getElementById( "return-button" )
        saveButton = document.getElementById( "save-button" );

    function displayApp() {
        app.style.display = "block";
    }

    function updateMenu( field, value ) {
        switch ( field ) {
            case "size":
                sizeValue.innerText = value;
                break;
            case "difficulty":
                difficultyValue.innerText = value;
                break;
        }
    }

    function display( option ) {
        switch ( option ) {
            case "menu":
                mineField.classList.remove( "u-display-block" );
                mineField.classList.add( "u-display-none" );
                loadingScreen.classList.remove( "u-display-block" );
                loadingScreen.classList.add( "u-display-none" );
                gameMenu.classList.remove( "u-display-none" );
                gameMenu.classList.add( "u-display-block" );
                break;
            case "game":
                gameMenu.classList.remove( "u-display-block" );
                gameMenu.classList.add( "u-display-none" );
                loadingScreen.classList.remove( "u-display-block" );
                loadingScreen.classList.add( "u-display-none" );
                mineField.classList.remove( "u-display-none" );
                mineField.classList.add( "u-display-block" );
                break;
            case "loading":
                gameMenu.classList.remove( "u-display-block" );
                gameMenu.classList.add( "u-display-none" );
                mineField.classList.remove( "u-display-block" );
                mineField.classList.add( "u-display-none" );
                loadingScreen.classList.remove( "u-display-none" );
                loadingScreen.classList.add( "u-display-block" );
                break;
        }
    }

    function createNewMineField( size ) {
        for( var i = 0; i < size; i++ ) {
            var newLine = document.createElement( "div" );
            newLine.classList.add( "mine-field-line" );
            newLine.id = `line-${ i }`;
    
            for( var j = 0; j < size; ++j ) {
                var newCell = document.createElement( "div" );
                newCell.classList.add( "cell" );
                newCell.classList.add( "cell-hidden" );
                newCell.classList.add( `cell-size-${ size }` );
                newCell.id = `${ i }-${ j }`;
                newCell.innerText = " ";
                newLine.appendChild( newCell );
            }
            
            mineField.appendChild( newLine );
        }
    }

    function toggleFlag( cellId ) {
        cell = document.getElementById( cellId );
        if ( !cell.classList.contains( "cell-hidden" ) ) { 
            return;
        }
        if ( cell.classList.contains( "cell-flag" ) ) {
            cell.classList.remove( "cell-flag" );
            return;
        }
        cell.classList.add( "cell-flag" );
    }

    function uncoverCell( cellId, value ) {
        cell = document.getElementById( cellId );
        cell.classList.remove( "cell-hidden" );
        if (value >= 0) {
            cell.classList.add( "cell-uncovered" );
            cell.classList.add( `cell-${ value }` );
            if ( value > 0 ) {
                cell.innerText = value;
            }
            return;
        }
        cell.classList.remove( "cell-flag" );
        cell.classList.add( "cell-mine" );
    }

    function gameOver( bombIds ) {
        for ( let i = 0; i < bombIds.length; ++i ) {
            cellBomb = document.getElementById( bombIds[i] );
            cellBomb.classList.remove( "cell-hidden" );
            cellBomb.classList.remove( "cell-flag" );
            cellBomb.classList.add( "cell-mine" );
        }
    }
    
    function gameWon( bombIds ) {
        for ( let i = 0; i < bombIds.length; ++i ) {
            cellBomb = document.getElementById( bombIds[i] );
            if ( !cellBomb.classList.contains( "cell-flag" ) ) {
                cellBomb.classList.add( "cell-flag" );
            }
        }
    }

    function displayFinalStatus( gameWon ) {
        if( gameWon ) {
            finalMessage.innerText = "YOU WON";
            finalMessage.classList.add( "text-green" );
        } else {
            finalMessage.innerText = "YOU LOST";
            finalMessage.classList.add( "text-red" );
        }
        finalStatus.style.display = "block";
    }

    function removeFinalStatus() {
        finalStatus.style.display = "none";
    }

    return {
        updateMenu: updateMenu,
        displayFinalStatus: displayFinalStatus,
        removeFinalStatus: removeFinalStatus,
        display: display,
        displayApp: displayApp,
        gameOver: gameOver,
        gameWon: gameWon,
        toggleFlag: toggleFlag,
        uncoverCell: uncoverCell,
        createNewMineField: createNewMineField,
        getDomElements: function() {
            return {
                menuButtons: menuButtons,
                startButton: startButton,
                returnButton: returnButton,
                saveButton: saveButton,
                mineField: mineField,
                userName: userName,
                gameScore: gameScore,
                totalScore: totalScore
            }
        }
    }
})();