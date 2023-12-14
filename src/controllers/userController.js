const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/usersDb/userModel");

const register = asyncHandler(async (req, res) => {
	try {
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

		if (
			!firstname ||
			!lastname ||
			!username ||
			!email ||
			!password ||
			!phone
		) {
			return res
				.status(400)
				.json({ message: "Please fill in all fields" });
		}

		const emailExists = await User.findOne({ email });
		const usernameExists = await User.findOne({ username });
		const phoneExists = await User.findOne({ phone });

		if (emailExists) {
			return res.status(400).json({ message: "Email is already in use" });
		} else if (usernameExists) {
			return res
				.status(400)
				.json({ message: "Username is already in use" });
		} else if (phoneExists) {
			return res
				.status(400)
				.json({ message: "Phone number is already in use " });
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
			subteam,
			grade,
			accountUpdateVersion: 0,
		});

		if (user) {
			return res.status(201).json({
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
			return res.status(400).json({ message: "Invalid user data" });
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Error" });
	}
});

const login = asyncHandler(async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const user = await User.findOne({
            $or: [{ username }, { email: username }],
        });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // this method intentionally does NOT return all user fields
        // use getMe, getUser, or getUserById to get all fields
        if (user && isMatch) {
            return res.json({
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
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error" });
    }
});

const checkToken = asyncHandler(async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded) {
			return res.json({ message: true });
		} else {
			return res.json({ message: false });
		}
	} catch (error) {
		return res.json({ message: false });
	}
});

const getMe = asyncHandler(async (req, res) => {
	try {
		const userFromDb = await User.findById(req.user.id);
		const user = userFromDb.toObject();
		// temporary solution while transitioning from v1 to v2
		if (user.isAdmin) delete user.isAdmin;
		if (user.isVerified) delete user.isVerified;
		return res.status(200).json({
			...user,
			token: generateToken(user._id),
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Error" });
	}
});

const deleteMe = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		await User.findByIdAndRemove(req.user.id);

		return res.status(200).json({ message: "User deleted" });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Error" });
	}
});

const updateMe = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.user.id,
			req.body,
			{
				new: true,
			}
		);

		return res.status(200).json(updatedUser);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Error" });
	}
});

const getUsersDefault = asyncHandler(async (req, res) => {
	try {
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
		return res.json(usersToSend);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Error" });
	}
});

const getUsersAdmin = asyncHandler(async (req, res) => {
	try {
		const users = await User.find(req.query);
		return res.json(users);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Error" });
	}
});

const getUserByIdDefault = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		} else {
			return res.json({
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
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Error" });
	}
});

const getUserByIdAdmin = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		} else {
			return res.json(user);
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Error" });
	}
});

const deleteUser = asyncHandler(async (req, res) => {
	console.log(req.params.id);
	try {
		const user = await User.findById(req.params.id);

		console.log(user);

		if (!user) {
			return res
				.status(404)
				.json({ message: "Requested user not found" });
		}

		await User.findByIdAndRemove(req.params.id);

		return res.status(200).json({
			message: "User deleted",
			id: req.params.id,
		});
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Error" });
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
			return res.status(200).json(updatedUser);
		} else {
			return res.status(500).json({ message: "Error" });
		}
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Error" });
	}
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
	deleteMe,
	getUsersDefault,
	getUsersAdmin,
	getUserByIdDefault,
	getUserByIdAdmin,
	deleteUser,
	updateUser,
	generateToken,
};
