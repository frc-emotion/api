const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/usersDb/userModel");

const register = asyncHandler(async (req, res) => {
	const { firstname, lastname, username, email, password, phone, roles } =
		req.body;

	if (
		!firstname ||
		!lastname ||
		!username ||
		!email ||
		!password ||
		!phone ||
		!roles
	) {
		res.status(400).json({ message: "Please fill in all fields" });
	}

	const emailExists = await User.findOne({ email });
	const usernameExists = await User.findOne({ username });
	const phoneExists = await User.findOne({ phone });

	if (emailExists) {
		res.status(400).json({ message: "Email is already in use" });
	} else if (usernameExists) {
		res.status(400).json({ message: "Username is already in use" });
	} else if (phoneExists) {
		res.status(400).json({ message: "Phone number is already in use " });
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({
		firstname,
		lastname,
		username,
		email,
		password: hashedPassword,
		phone,
		accountType: 0,
		roles,
		accountUpdateVersion: 0,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			firstname: user.firstname,
			lastname: user.lastname,
			username: user.username,
			email: user.email,
			phone: user.phone,
			accountType: user.accountType,
			roles: user.roles,
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
		res.status(400).json({ message: "User does not exist" });
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!user || !isMatch) {
		res.status(400).json({ message: "Invalid credentials" });
	}

	// this method intentionally does NOT return all user fields
	// use getMe, getUser, or getUserById to get all fields
	if (user && isMatch) {
		res.json({
			_id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			username: user.username,
			email: user.email,
			accountType: user.accountType,
			roles: user.roles,
			token: generateToken(user._id),
		});
	}
});

const checkToken = asyncHandler(async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded) {
			res.json({ message: true });
		} else {
			res.json({ message: false });
		}
	} catch (error) {
		res.json({ message: false });
	}
});

const getMe = asyncHandler(async (req, res) => {
	const {
		_id,
		firstname,
		lastname,
		username,
		email,
		phone,
		subteam,
		roles,
		accountType,
		accountUpdateVersion,
		socials,
		children,
		spouse,
		donationAmounts,
		employer,
		parents,
		attendance,
	} = await User.findById(req.user.id);
	res.status(200).json({
		id: _id,
		firstname,
		lastname,
		username,
		email,
		phone,
		grade,
		subteam,
		roles,
		accountType,
		accountUpdateVersion,
		socials,
		children,
		spouse,
		donationAmounts,
		employer,
		parents,
		attendance,
	});
});

const updateMe = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(400);
		throw new Error("User not found");
	}

	const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
		new: true,
	});

	res.status(200).json(updatedUser);
});

const getUsersDefault = asyncHandler(async (req, res) => {
	const users = await User.find(req.query);
	let usersToSend = [];
	for (let i = 0; i < users.length; i++) {
		usersToSend.push({
			id: users[i]._id,
			firstname: users[i].firstname,
			lastname: users[i].lastname,
			username: users[i].username,
			email: users[i].email,
			subteam: users[i].subteam,
			socials: users[i].socials,
			grade: users[i].grade,
		});
	}
	res.json(usersToSend);
});

const getUsersAdmin = asyncHandler(async (req, res) => {
	const users = await User.find(req.query);
	res.json(users);
});

const getUserByIdDefault = asyncHandler(async (req, res) => {
	const user = await User.finById(req.params.id);
	if (!user) {
		res.status(400).json({ message: "User not found" });
	} else {
		res.json({
			id: user._id,
			firstname: user.firstname,
			lastname: user.lastname,
			username: user.username,
			email: user.email,
			subteam: user.subteam,
			socials: user.socials,
			grade: user.grade,
		});
	}
});

const getUserByIdAdmin = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		res.status(400).json({ message: "User not found" });
	} else {
		res.json(user);
	}
});

const deleteUser = asyncHandler(async (req, res) => {
	const user = User.findById(req.params.id);

	if (!user) {
		res.status(400);
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

// generate JHT token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports = {
	register,
	login,
	checkToken,
	getMe,
	updateMe,
	getUsersDefault,
	getUsersAdmin,
	getUserByIdDefault,
	getUserByIdAdmin,
	deleteUser,
	updateUser,
};
