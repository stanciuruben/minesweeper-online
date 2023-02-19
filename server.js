const express = require("express");
const config = require("config");
const http = require("http");
const socketio = require("socket.io");
const connectDB = require("./db");
const minesweeperController = require("./socket-controller");
const cookieParser = require("cookie-parser");

// Create Express Socket.io server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

connectDB();

// Connect sockets to minesweeper logic
io.on("connection", minesweeperController);

app.use(express.json({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));

// Set Routes
app.use("/minesweeper/register", require("./routes/register"));
app.use("/minesweeper/login", require("./routes/login"));
app.use("/minesweeper/game", require("./routes/game"));

const PORT = 3000; // config.get('PORT')

const listener = server.listen(PORT, () => {
	console.log("Node.js listening on port " + listener.address().port);
});
