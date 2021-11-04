const Logic = ( function () {
    function addBombs( size, difficulty, mineField ) {
        let bombAmmount,
            bombIds = [];
        switch ( difficulty ) {
            case "easy":
                bombAmmount = Math.round( size );
                break;
            case "medium":
                bombAmmount = Math.round( size * 2 );
                break;
            case "hard":
                bombAmmount = Math.round( size * 3 );
                break;
        }

        for ( let i = 0; i < bombAmmount; i++ ) {
            // Adding random mines on the mineFieldMap 
            let bombX = Math.floor( ( Math.random() * size ) ),
                bombY = Math.floor( ( Math.random() * size ) );
            while ( mineField[ bombX ][ bombY ].value < 0 ) {
                bombX = Math.floor( ( Math.random() * size ) );
                bombY = Math.floor( ( Math.random() * size ) );
            }

            // Increasing value of neighbour cells
            for ( let x = bombX - 1; x <= bombX + 1; ++x ) {
                for ( let y = bombY - 1; y <= bombY + 1; ++y ) {
                    if (
                        ( x === bombX && y === bombY )
                        || x >= size || x < 0
                        || y >= size || y < 0
                        || mineField[ x ][ y ].value === -1
                    ) { continue }

                    mineField[ x ][ y ].value += 1;
                }
            }

            // Setting field on -1 where there is a bomb
            // adding bomb id to bombIds array
            mineField[ bombX ][ bombY ].value = -1;
            bombIds.push(`${ bombX }-${ bombY }`);
        }

        return bombIds;
    }

    function uncoverCell( x, y, mineField, size ) {
        if ( mineField[ x ][ y ].uncovered ) { 
            return { 
                gameLost: false,
                score: 0
            } 
        }

        if ( mineField[ x ][ y ].value === 0 ) {
            return uncoverFreeField( x, y, size, mineField );
        }
        if ( mineField[ x ][ y ].value === -1 ) {
            return { gameLost: true }
        }

        mineField[ x ][ y ].uncovered = true;
        const value = mineField[ x ][ y ].value;
        return { 
            uncoveredCells: [ { x, y, value } ],
            score: value,
            gameLost: false
        }
    }

    function uncoverFreeField ( x, y, size, mineField ) {
        let score = 0
        let cellsToBeSearchedIndex = 0;
        const cellsToBeSearched = [
            {
                x, 
                y
            }
        ];
        const uncoveredCells = [
            {
                x, 
                y,
                value: mineField[ x ][ y ].value
            }
        ];
        // Search all cells that should be uncovered when the user
        // clicks on a free cell that has no mines nearby.
        while ( cellsToBeSearchedIndex < cellsToBeSearched.length ) {
            const x = cellsToBeSearched[ cellsToBeSearchedIndex ].x;
            const y = cellsToBeSearched[ cellsToBeSearchedIndex ].y;
            ++cellsToBeSearchedIndex;
            mineField[ x ][ y ].uncovered = true;

            for ( let i = x - 1; i <= x + 1; ++i ) {
                for ( let j = y - 1; j <= y + 1; ++j ) {

                    // check if coordinates are out of range
                    // and if minefield is already been searched
                    if ( i < 0 || i >= size || j < 0 || j >= size ) { continue; }
                    if ( mineField[ i ][ j ].uncovered ) { continue; }

                    // if cell is has no mines nearby
                    // add cell to uncoveredCells and search cells neighbours next iteration
                    if ( mineField[ i ][ j ].value === 0 ) {
                        uncoveredCells.push(
                            {
                                x: i,
                                y: j,
                                value: mineField[ i ][ j ].value
                            }
                        );
                        cellsToBeSearched.push(
                            {
                                x: i,
                                y: j
                            }
                        );
                    }
                    // if cell is near one mine or more add to uncoveredCells
                    // but do not search its neighbours again
                    if ( mineField[ i ][ j ].value > 0 ) {
                        uncoveredCells.push(
                            {
                                x: i,
                                y: j,
                                value: mineField[ i ][ j ].value
                            }
                        );
                        score += mineField[ i ][ j ].value;
                    }

                    mineField[ i ][ j ].uncovered = true;
                }
            }
        }

        return {
            uncoveredCells, 
            score,
            gameLost: false
        };
    }

    function isGameWon ( ammountOfUncoveredCells, gameSize, ammountOfBombs ) {
        if ( ammountOfUncoveredCells >= gameSize * gameSize - ammountOfBombs ) {
            return true;
        }
        return false;
    }

    return {
        addBombs,
        uncoverCell,
        uncoverFreeField,
        isGameWon
    }
})();

module.exports = Logic;