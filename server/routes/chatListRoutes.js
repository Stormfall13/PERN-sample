const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getStartedChats,
  addToStartedChats,
  removeFromStartedChats,
} = require("../controllers/chatListController");

router.get("/started", authMiddleware, getStartedChats);
router.post("/started", authMiddleware, addToStartedChats);
router.delete("/started", authMiddleware, removeFromStartedChats);

module.exports = router;
