const express = require("express");
const router = express.Router();
const { login, checkToken, getMe } = require("./userController");
const protect = require("./protect.js");
const deprecatedRoute = require("../deprecatedRoute");

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
