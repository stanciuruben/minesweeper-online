const express = require("express");
const path = require("path");
const { readFileSync } = require("fs");
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");
const cors = require('cors');
const minesweeperController = require("./socket-controller");
const cookieParser = require("cookie-parser");
const config = require("config");

const app = express();
const whitelist = ['https://46.41.148.88', 'https://www.rubenstanciu.com'];
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
const httpsServer = createServer({
	cert: readFileSync(config.get('ssl-cert')),
	key: readFileSync(config.get('ssl-key'))
  });
const io = new Server(httpsServer);

connectDB();

io.on("connection", () => console.log('connected to server'));

app.use(express.json({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/')));

// Set Routes
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/game", require("./routes/game"));

const PORT = 3000; // config.get('PORT')

const listener = httpServer.listen(PORT, () => {
	console.log("Node.js listening on port " + listener.address().port);
});
