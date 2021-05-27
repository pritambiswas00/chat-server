const express = require("express");
const router = express.Router();
require("dotenv").config({ path: "../config/config.env" });
const chatController = require("../controllers/chat/chat");
const fetch = require("node-fetch");
const Users = require("../Model/usersModel");
const moment = require("moment");

router
  .post(
    "/account/conversations",

    chatController.getAllConversation ///////Get All the conversation for specific agent by providing agentid in the body
  )
  .post(
    "/account/conversations/messages",
    chatController.messageToSpecificConversation
  );

router.get(
  "/account/:agentid/conversations",
  chatController.getAllConversationBySort
);

router.post(
  "/account/:agentid/conversations/:conversationid/toggle",
  chatController.conversationToggleStatus
);
router.get("/:agentid/agentstatus", chatController.agentStatusCheck);

router.patch("/account/:agentid/status", chatController.agentStatusController);

module.exports = router;
