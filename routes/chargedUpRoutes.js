const express = require("express");
const router = express.Router();
const {
	getGames,
	createGame,
	updateGame,
	deleteGame,
} = require("../controllers/chargedUpController");

const protect = require("../middleware/authMiddleware");
const fillTeamName = require("../middleware/fillTeamName");
const { editHistory } = require("../middleware/editHistory");

router
	.route("/")
	.post(protect(1), fillTeamName, editHistory, createGame)
	.get(protect(1, getGames));
router
	.route("/:id")
	.get(protect(1, getGames))
	.put(protect(1), editHistory, updateGame)
	.delete(protect(1, deleteGame));

module.exports = router;
