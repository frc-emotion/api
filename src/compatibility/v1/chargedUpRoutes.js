const express = require("express");
const router = express.Router();
const {
	getGames,
	createGame,
	updateGame,
	deleteGame,
} = require("../../controllers/chargedUpController");
const fillTeamName = require("../../middleware/fillTeamName");
const { editHistory } = require("../../middleware/editHistory");
const protect = require("./protect.js");

router
	.route("/")
	.post(protect, fillTeamName, editHistory, createGame)
	.get(protect, getGames);
router
	.route("/:id")
	.get(protect, getGames)
	.put(protect, editHistory, updateGame)
	.delete(protect, deleteGame);

module.exports = router;
