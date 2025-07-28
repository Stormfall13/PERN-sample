const express = require("express");
const router = express.Router();
const { createChat, getUserChats, sendMessage, getMessages, deleteChat } = require("../controllers/chatController");

router.post("/create", createChat);
router.get("/:userId", getUserChats);
router.post("/message", sendMessage);
router.get("/messages/:chatId", getMessages);
router.delete("/delete/:chatId", deleteChat);

module.exports = router;
