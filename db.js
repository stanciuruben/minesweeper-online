const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongoURI");
mongoose.set("strictQuery", false);

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
		});
		console.log("DB CONNECTED");
	} catch (err) {
		// Exit process with failure
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
