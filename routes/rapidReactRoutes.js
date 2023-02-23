const express = require("express");
const router = express.Router();
const {
    getGames,
    setGame,
    updateGame,
    deleteGame,
} = require("../controllers/rapidReactController");

const { verifiedProtect } = require("../middleware/authMiddleware");
const { editHistory } = require("../middleware/editHistory")

// all routes require user to be verified before making a request
// authorization middleware checks for bearer token in header
router.route("/").post(verifiedProtect, editHistory, setGame).get(verifiedProtect, getGames);
router
    .route("/:id")
    .get(verifiedProtect, getGames)
    .put(verifiedProtect, editHistory, updateGame)
    .delete(verifiedProtect, deleteGame);

module.exports = router;
