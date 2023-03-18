const express = require("express");
const router = express.Router();
const {
	register,
	login,
	getMe,
	deleteMe,
	updateMe,
	getUsers,
	getUserById,
	deleteUser,
	updateUser,
} = require("../controllers/userController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

// handle user signups and logins
router.post("/register", register);
router.post("/login", login); // login returns jwt to user

router.get("/verify", protect, (req, res) => {
	res.status(200).send("OK");
});

// get, delete, and update users
// getting lists of users requires admin permission
router.route("/").get(adminProtect, getUsers);
router
	.route("/id/:id")
	.get(adminProtect, getUserById)
	.delete(adminProtect, deleteUser)
	.put(adminProtect, updateUser);

// user actions that can be called by user, requires bearer token
router
	.route("/me")
	.get(protect, getMe)
	.put(protect, updateMe)
	.delete(protect, deleteMe);

module.exports = router;
