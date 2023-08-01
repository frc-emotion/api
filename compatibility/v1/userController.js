const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../../models/usersDb/userModel");

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

	const isCompatible = user.isAdmin || user.isVerified;
	if (!isCompatible) {
		res.status(405).json({
			message: "User is not compatible with the v1 API",
		});
	}

	// this method intentionally does NOT return all user fields
	// use getMe, getUser, or getUserById to get all fields
	if (user && isMatch && isCompatible) {
		res.json({
			_id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			username: user.username,
			email: user.email,
			isVerified: user.isVerified,
			isAdmin: user.isAdmin,
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
	const { _id, firstname, lastname, username, email, isAdmin, isVerified } =
		await User.findById(req.user.id);

	const v1Compatible = user.isAdmin || user.isVerified;

	if (v1Compatible) {
		res.status(200).json({
			id: _id,
			firstname,
			lastname,
			username,
			email,
			isAdmin,
			isVerified,
		});
	} else {
		res.status(405).json({
			message: "User is not compatible with the v1 API",
		});
	}
});

// generate JHT token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports = {
	login,
	checkToken,
	getMe,
};
