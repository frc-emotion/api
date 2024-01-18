const express = require("express");
const router = express.Router();
const {
	register,
	login,
	checkToken,
	getMe,
	updateMe,
	deleteMe,
	resetForgotten,
	getUsersAdmin,
	getUserByIdDefault,
	getUserByIdAdmin,
	deleteUser,
	forgot,
	updateUser,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

// handle user signups and logins
router.post("/register", register);
router.post("/login", login); // login returns jwt to user
router.get("/verify", checkToken);
router.post("/forgot-password", forgot);
router.post("/reset-password", resetForgotten);

// get, delete, and update users
// getting lists of users requires admin permission
router.route("/").get(protect(3, getUsersAdmin));
router
	.get("/user/:id", protect(3, getUserByIdAdmin, getUserByIdDefault))
	.delete("/user/:id", protect(3, deleteUser))
	.put("/user/:id", protect(3, updateUser));

// // user actions that can be called by user, requires bearer token
router
	.route("/me")
	.get(protect(0), getMe)
	.put(protect(0), updateMe)
	.delete(protect(0, deleteMe));

module.exports = router;
