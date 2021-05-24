const express = require("express");
const router = express.Router();
const { agentJoin, getAgent } = require("../utlis/agentSideComponents");

router.post("/recieveMessage", (req, res) => {
  const io = req.app.get("socket.io");
});

module.exports = router;
