const express = require("express");
const router = express.Router();
const {
    getUsers
} = require("../controllers/usersController");

module.exports = router;

router.route("/:getUsers").get(getUsers);
