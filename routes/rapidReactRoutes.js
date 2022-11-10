const express = require("express");
const router = express.Router();
const {
    getGames,
    setGame,
    updateGame,
    deleteGame,
} = require("../controllers/rapidReactController");

module.exports = router;

router.route("/:competition").post(setGame).get(getGames);
router.route("/:competition/:id").put(updateGame).delete(deleteGame);
