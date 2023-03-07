const express = require("express");
const path = require("path");
const connectDB = require("./db");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const socketController = require('./socket-controller')

const app = express();
app.use(express.json({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/')));
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
const io = require("socket.io")(3001, { cors: corsOptions });

connectDB();

io.on("connection", socketController);

// Set Routes
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/game", require("./routes/game"));

const PORT = 3000; // config.get('PORT')
app.listen(PORT, () => {
	console.log("Node.js listening on port " + PORT);
});
