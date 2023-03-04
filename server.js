const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const connectDB = require("./db");
const cors = require('cors');
const minesweeperController = require("./socket-controller");
const cookieParser = require("cookie-parser");

// Create Express Socket.io server
const app = express();
const whitelist = ['http://localhost:3000','http://46.41.148.88', 'http://www.rubenstanciu.com', 'https://www.rubenstanciu.com'];
const corsOptions = {
	origin: (origin, callback) => {
		if (origin === undefined || whitelist.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true
};
app.use(cors(corsOptions));
const server = http.createServer(app);
const io = socketio('http://46.41.148.88');

connectDB();

// Connect sockets to minesweeper logic
io.on("connection", minesweeperController);

app.use(express.json({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/')));

// Set Routes
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/game", require("./routes/game"));

const PORT = 3000; // config.get('PORT')

const listener = server.listen(PORT, () => {
	console.log("Node.js listening on port " + listener.address().port);
});
