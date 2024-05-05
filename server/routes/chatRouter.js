const Router = require("express");
const chatController = require("../controllers/chatController");

const router = new Router();

router.post("/message", chatController.postMessage);
router.get("/chat-list/:id", chatController.getChatList);
router.get("/:from/:to", chatController.getChats);
router.put("/mark-as-read/:id", chatController.markAsRead);

module.exports = router;
