const express = require("express");
const router = express.Router();
const { doctorChat } = require("../controllers/chat.controller");

router.post("/doctor", doctorChat);

module.exports = router;
