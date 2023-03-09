# minesweeper-online

Tools used:   ***Node,   Express,   MongoDB,   Socket.io,    Jsonwebtoken,    Bcrypt,    Javascript,    Html,    Css.***

The goal for this project was to make a copy of the minesweeper game that is impossible to cheat in.
After making a minesweeper game who runs locally in the browser; I realized that users could change the data locally, and have better scores or even see the position of the mines.

To play this game you have to register with an email and a password.
Your data is stored on mongoDB and the password gets encrypted with bcrypt.

Authentication is made with JWT.
Everytime you log in or refresh the game, the server ask for the JWT witch gets stored in a cookie after getting registred or logging in
If there is no such cookie or the token is expired the user gets rerouted to the login page.

In this app I moved all the data in a database, the client has only access to a **controller** that sends user input to the server and receives the data already processed.
Then passes that "processed data" to the **view**, which dispalys everything in the client.

The app sends and receives data with **socket.io**.
On the client side everytime a user clicks on a game field or a button the data is snet to the server trough socket.io.
On the server socket.io listens for requests and processes the sent data and sends a response to the user.

You can also save an instance of a not finished game, and have it ready when you log in the next time.
