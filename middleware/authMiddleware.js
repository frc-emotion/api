const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/* 

const protect = asyncHandler(async (req, res, next) => {
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
			res.status(401);
			throw new Error("Token failed");
		}
	}

	if (!token) {
		res.status(401);
		throw new Error("No token");
	}
});

const verifiedProtect = asyncHandler(async (req, res, next) => {
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

            // check if user is verified
			if (req.user.isVerified) {
				next();
			} else {
				res.status(401);
				throw new Error("User not verified");
			}
		} catch (err) {
			console.log(err);
			res.status(401);
			throw new Error("Token failed");
		}
	}

	if (!token) {
		res.status(401);
		throw new Error("No token");
	}
});

const adminProtect = asyncHandler(async (req, res, next) => {
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

            // check if user is admin
            if (req.user.isAdmin) {
                next();
            } else {
                res.status(401);
                throw new Error("User is not an administrator");
            }
        } catch (err) {
            console.log(err);
            res.status(401);
            throw new Error("Token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("No token");
    }
});
*/

const protect = asyncHandler(async (req, res, next) => {
	next();
});

const verifiedProtect = protect;
const adminProtect = protect;

module.exports = { protect, verifiedProtect, adminProtect };
