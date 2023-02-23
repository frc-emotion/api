const express = require("express");
const router = express.Router();
const {
	getGames,
	createGame,
	updateGame,
	deleteGame,
} = require("../controllers/chargedUpController");

const { verifiedProtect } = require("../middleware/authMiddleware");
const fillTeamName = require("../middleware/fillTeamName");
const { editHistory } = require("../middleware/editHistory");

router
	.route("/")
	.post(verifiedProtect, fillTeamName, editHistory, createGame)
	.get(verifiedProtect, getGames);
router
	.route("/:id")
	.get(verifiedProtect, getGames)
	.put(verifiedProtect, editHistory, updateGame)
	.delete(verifiedProtect, deleteGame);

module.exports = router;
