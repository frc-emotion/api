const express = require("express");
const router = express.Router();
const { login, checkToken, getMe } = require("./userController");
const jwt = require("jsonwebtoken");
const User = require("../../models/usersDb/userModel");
const asyncHandler = require("express-async-handler");
const deprecatedRoute = require("../deprecatedRoute");

const protect = asyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.id).select("-password");
			next();
		} catch (err) {
			console.log(err);
			res.status(401).json({ message: "Token failed" });
		}
	}
	if (!token) {
		res.status(401).json({ message: "No token" });
	}
});

// handle user signups and logins
router.post("/register", deprecatedRoute);
router.post("/login", login); // only returns if user is backwards compatible
router.get("/verify", checkToken);

// get, delete, and update users
// getting lists of users requires admin permission
router.route("/").get(deprecatedRoute);
router
	.route("/id/:id")
	.get(deprecatedRoute)
	.delete(deprecatedRoute)
	.put(deprecatedRoute);

// // user actions that can be called by user, requires bearer token
router.route("/me").get(protect, getMe).put(deprecatedRoute);

module.exports = router;
