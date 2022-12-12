const express = require("express");
const router = express.Router();
const {
	register,
	login,
	getMe,
	getUsers,
	deleteUser,
	updateUser,
} = require("../controllers/userController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

// handle user signups and logins
router.post("/register", register);
router.post("/login", login); // login returns jwt to user

// returns list of all users, must be admin to call
router.get("/users", adminProtect, getUsers);
// user actions by user id, must be admin to call
router
	.route("/users/:id")
	.get(adminProtect, getUsers)
	.delete(adminProtect, deleteUser);
// get list of admins, must be admin to call
router.get("/users/:isAdmin", adminProtect, getUsers);
// get list of verified users, must be admin to call
router.get("/users/:isVerified", adminProtect, getUsers);

// user actions that can be called by user, requires bearer token
router
	.route("/me")
	.get(protect, getMe)
	.delete(protect, deleteUser)
	.put(protect, updateUser);

module.exports = router;
