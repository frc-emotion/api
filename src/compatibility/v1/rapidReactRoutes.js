const express = require("express");
const router = express.Router();
const {
	getGames,
	setGame,
	updateGame,
	deleteGame,
} = require("../../controllers/rapidReactController");
const protect = require("./protect");
const { editHistory } = require("../../middleware/editHistory");

// all routes require user to be verified before making a request
// authorization middleware checks for bearer token in header
router.route("/").post(protect, editHistory, setGame).get(protect, getGames);
router
	.route("/:id")
	.get(protect, getGames)
	.put(protect, editHistory, updateGame)
	.delete(protect, deleteGame);

module.exports = router;
