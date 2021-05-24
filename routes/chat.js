const express = require("express");
const router = express.Router();
require("dotenv").config({ path: "../config/config.env" });
const chatController = require("../controllers/chat/chat");

router
  .post(
    "/account/conversations",

    chatController.getAllConversation ///////Get All the conversation for specific agent by providing agentid in the body
  )
  .post(
    "/account/conversations/messages",
    chatController.messageToSpecificConversation
  );

module.exports = router;
