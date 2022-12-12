const express = require("express");
const router = express.Router();
const {
    getGames,
    setGame,
    updateGame,
    deleteGame,
} = require("../controllers/rapidReactController");

const { verifiedProtect } = require("../middleware/authMiddleware");

// all routes require user to be verified before making a request
// authorization middleware checks for bearer token in header
router.route("/").post(verifiedProtect, setGame).get(verifiedProtect, getGames);
router.route("/:id").put(verifiedProtect, updateGame).delete(verifiedProtect, deleteGame);
router.route("/:competition").post(verifiedProtect, setGame).get(verifiedProtect, getGames);
router.route("/:competition/:id").put(verifiedProtect, updateGame).delete(verifiedProtect, deleteGame);

module.exports = router;