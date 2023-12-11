const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/usersDb/userModel");

/**
 * @typedef {Object} registerParams
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} phone
 * @property {string} subteam
 * @property {number} grade
 */

/**
 * @typedef {Object} userParams
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} phone
 * @property {number} accountType
 * @property {string} subteam
 * @property {number} grade
 * @property {number} accountUpdateVersion
 */

const register = asyncHandler(async (req, res) => {
	/**@type {registerParams} */
	const {
		firstname,
		lastname,
		username,
		email,
		password,
		phone,
		subteam,
		grade,
	} = req.body;

	if (!firstname || !lastname || !username || !email || !password || !phone) {
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

	/**@type {userParams} */
	const user = await User.create({
		firstname,
		lastname,
		username,
		email,
		password: hashedPassword,
		phone,
		accountType: 0,
		subteam,
		grade,
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
			grade: user.grade,
			subteam: user.subteam,
			attendance: user.attendance,
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

	// this method intentionally does NOT return all user fields
	// use getMe, getUser, or getUserById to get all fields
	if (user && isMatch) {
		/** @type {userParams} */
		res.json({
			_id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			username: user.username,
			email: user.email,
			grade: user.grade,
			phone: user.phone,
			attendance: user.attendance,
			accountType: user.accountType,
			roles: user.roles,
			token: generateToken(user._id),
			subteam: user.subteam,
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
	const userFromDb = await User.findById(req.user.id);
	const user = userFromDb.toObject();
	// temporary solution while transitioning from v1 to v2
	if (user.isAdmin) delete user.isAdmin;
	if (user.isVerified) delete user.isVerified;
	res.status(200).json({
		...user,
		token: generateToken(user._id),
	});
});

const deleteMe = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		if (!user) {
			res.status(404);
			throw new Error("User not found");
		}

		await User.findByIdAndRemove(req.user.id);

		res.status(200).json({ message: "User deleted" });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Error" });
		return;
	}
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

	// temporary solution while transitioning from v1 to v2
	const updatedUserObj = updatedUser.toObject();
	if (updatedUserObj.isAdmin) delete updatedUserObj.isAdmin;
	if (updatedUserObj.isVerified) delete updatedUserObj.isVerified;

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
		res.status(404).json({ message: "User not found" });
	} else {
		res.json(user);
	}
});

const deleteUser = asyncHandler(async (req, res) => {
	console.log(req.params.id);
	try {
		const user = await User.findById(req.params.id);

		console.log(user);

		if (!user) {
			res.status(404);
			throw new Error("Requested user not found");
		}

		await User.findByIdAndRemove(req.params.id);

		res.status(200).json({
			message: "User deleted",
			id: req.params.id,
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Error" });
		return;
	}
});

const updateUser = asyncHandler(async (req, res) => {
	console.log(req.params);
	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
			}
		);

		if (updatedUser) {
			res.status(200).json(updatedUser);
		} else {
			res.status(500).json({ message: "Error" });
			return;
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Error" });
		return;
	}
});

// generate JHT token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET);
};

/**@type {moduleExports} */
module.exports = {
	register,
	login,
	checkToken,
	getMe,
	updateMe,
	deleteMe,
	getUsersDefault,
	getUsersAdmin,
	getUserByIdDefault,
	getUserByIdAdmin,
	deleteUser,
	updateUser,
	generateToken,
};
