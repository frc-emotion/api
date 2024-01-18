const express = require("express");
const router = express.Router();
const {
	getGames,
	setGame,
	updateGame,
	deleteGame,
} = require("../controllers/crescendoController");

const protect = require("../middleware/authMiddleware");
const { editHistory } = require("../middleware/editHistory");

// all routes require user to be verified before making a request
// authorization middleware checks for bearer token in header
router
	.route("/")
	.post(protect(1), editHistory, setGame)
	.get(protect(1, getGames));
router
	.route("/:id")
	.get(protect(1, getGames))
	.put(protect(1), editHistory, updateGame)
	.delete(protect(1, deleteGame));

module.exports = router;
