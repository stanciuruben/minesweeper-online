# minesweeper-online

Tools used: Node,   Express,   Socket.io,    Javascript,    Html,    Css.

The goal for this project was to make a copy of the minesweeper game that is almost impossible to cheat in.
After making a minesweeper game who runs locally in the browser; I realized that users could change the data locally, and have better scores or even see the position of the mines.

In this app I moved all the data in a database, the client has only access to a controller who sends user input to the server and receives the data already processed.
Then passes that processed data to the view who dispalys everything in the browser.

