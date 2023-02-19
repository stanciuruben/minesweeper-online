const path = require("path");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

// @route   GET
// @desc    register.html
// @access  Public
router.get("/", async (req, res) => {
	res.sendFile(path.resolve(__dirname, "../pages/register.html"));
});

// @route   GET
// @desc    register user
// @access  Public
router.post("/", async (req, res) => {
	const { name, email, repeatedEmail, password, repeatedPassword } = req.body;

	// Form validation
	const errors = [];
	if (name.length < 3) {
		errors.push("Name should be at least 3 characters!");
	}
	const user = await User.find({ email });
	if (user.length > 0) {
		errors.push("Email already exists!");
	}
	if (
		!email.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
	) {
		errors.push("Invalid Email!");
	}
	if (email !== repeatedEmail) {
		errors.push("Emails do not match!");
	}
	if (password.length < 6) {
		errors.push("Password must be at least 6 characters!");
	}
	if (password !== repeatedPassword) {
		errors.push("Passwords do not match!");
	}
	if (errors.length > 0) {
		return res.status(400).json({ errors });
	}

	try {
		// Create new user and add it to database
		const user = new User({
			name,
			email,
			password,
		});

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		await user.save();

		// return JWT
		const payload = {
			user: {
				iat: Date.now() / 1000,
				id: user.id,
			},
		};

		jwt.sign(
			payload,
			config.get("jwtSecret"),
			{ expiresIn: 3600 },
			(err, token) => {
				if (err) throw err;
				return res.json({ token });
			}
		);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ errors: ["Server error"] });
	}
});

module.exports = router;
