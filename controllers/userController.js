const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const register = asyncHandler(async (req, res) => {
	const { firstname, lastname, username, email, password } = req.body;

	if (!firstname || !lastname || !username || !email || !password) {
		res.status(400).json({ message: "Please fill in all fields" });
	}

	const emailExists = await User.findOne({ email });
	const usernameExists = await User.findOne({ username });

	if (emailExists || usernameExists) {
		res.status(400).json({ message: "User already exists" });
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({
		firstname,
		lastname,
		username,
		email,
		password: hashedPassword,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			firstname: user.firstname,
			lastname: user.lastname,
			username: user.username,
			email: user.email,
			isAdmin: user.isAdmin,
			isVerified: user.isVerified,
			token: generateToken(user._id),
		});
	} else {
		res.status(400).json({ message: "Invalid user data" });
	}
});

const login = asyncHandler(async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(400).json({ message: "Please fill in all fields" });
	}

	const user = await User.findOne({ username });
	const isMatch = await bcrypt.compare(password, user.password);
	if (!user || !isMatch) {
		res.status(400).json({ message: "Invalid credentials" });
	}

	if (user && isMatch) {
		res.json({
			_id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			username: user.username,
			email: user.email,
			isAdmin: user.isAdmin,
			isVerified: user.isVerified,
			token: generateToken(user._id),
		});
	}
});

const getMe = asyncHandler(async (req, res) => {
	const { _id, firstname, lastname, username, email, isAdmin, isVerified } =
		await User.findById(req.user.id);
	res.status(200).json({
		id: _id,
		firstname,
		lastname,
		username,
		email,
		isAdmin,
		isVerified,
	});
});

const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
	res.json({ message: "User deleted" });
});

const updateUser = asyncHandler(async (req, res) => {
	res.json({ message: "User updated" });
});

// generate JHT token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports = {
	register,
	login,
	getMe,
	getUsers,
	deleteUser,
	updateUser,
};