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
	if (!user) {
		res.status(404).json({ message: "User does not exist" });
	}
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

const checkToken = asyncHandler(async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded) {
			res.json({ message: "TRUE" });
		} else {
			res.json({ message: "FALSE" });
		}
	} catch (error) {
		res.json({ message: "FALSE" });
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

const deleteMe = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}

	await User.findByIdAndRemove(req.user.id);

	res.status(200).json({ message: "User deleted" });
});

const updateMe = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}

	const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
		new: true,
	});

	res.status(200).json(updatedUser);
});

const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find(req.query);
	res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		res.status(404).json({ message: "User not found" });
	} else {
		res.json(user);
	}
});

const deleteUser = asyncHandler(async (req, res) => {
	const user = User.findById(req.params.id);

	if (!user) {
		res.status(404);
		throw new Error("Requested user not found");
	}

	await User.findByIdAndRemove(req.params.id);

	res.status(200).json({
		message: "User deleted",
		id: req.params.id,
	});
});

const updateUser = asyncHandler(async (req, res) => {
	const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});

	res.status(200).json(updatedUser);
});

const verifyUser = asyncHandler(async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.params.id,
		{
			isVerified: true,
		},
		{ new: true }
	);

	res.status(200).json(user);
});

const adminUser = asyncHandler(async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.params.id,
		{ isVerified: true, isAdmin: true },
		{ new: true }
	);
	res.status(200).json(user);
});
// generate JHT token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports = {
	register,
	login,
	checkToken,
	getMe,
	deleteMe,
	updateMe,
	getUsers,
	getUserById,
	deleteUser,
	updateUser,
	verifyUser,
	adminUser,
};
