const jwt = require("jsonwebtoken");
const User = require("../models/usersDb/userModel");

function protect(level, protecting, fallback) {
	return async function (req, res, next) {
		let token;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			try {
				// Set token from Bearer token in header
				token = req.headers.authorization.split(" ")[1];

				// Verify token
				const decoded = jwt.verify(token, process.env.JWT_SECRET);

				// Get user from token
				req.user = await User.findById(decoded.id).select("-password");

				next();
			} catch (err) {
				console.log(err);
				res.status(401).json({
					message: "Not authorized, token failed",
				});
			}
		}

		if (!token) {
			res.status(401).json({ message: "No token" });
		} else {
			const accountType = req.user?.accountType >= level;
			if (accountType && protecting) {
				protecting(req, res);
			} else if (accountType) {
				next();
			} else if (fallback) {
				fallback(req, res);
			} else {
				res.status(401).json({ message: "Unauthorized" });
			}
		}
	};
}

module.exports = protect;
