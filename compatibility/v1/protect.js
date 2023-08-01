const jwt = require("jsonwebtoken");
const User = require("../../models/usersDb/userModel");
const asyncHandler = require("express-async-handler");

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
			if (req.user.toObject().isAdmin || req.user.toObject().isVerified) {
				next();
			} else {
				res.status(405).json({
					message: "User is not compatible with the v1 API",
				});
			}
		} catch (err) {
			console.log(err);
			res.status(401).json({ message: "Token failed" });
		}
	}
	if (!token) {
		res.status(401).json({ message: "No token" });
	}
});

module.exports = protect;
