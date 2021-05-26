const express = require("express");
const app = express();
const router = express.Router();
const { getAgent, getClient } = require("../utlis/agentSideComponents");

router.post("/recieveMessage", (req, res) => {
  console.log(req.body + " at recieve Message ");
  // const io = req.app.get("io");

  const { content, conversation_id, sender } = req.body;
  // io.on('connection',(socket)=> {
  if (sender.type === "user") {
    const client = getClient(conversation_id);
    socket.broadcast
      .to(client.socketid)
      .emit("clientmessage", { content, conversation_id, sender });
  } else {
    const agent = getAgent(conversation_id);
  }
  // })
});
router.get("/testhook", (req, res) => {
  console.log(req.body + "test hook");
  res.json({ success: true });
});
router.post("/testhook", (req, res) => {
  console.log(req.body);
});

module.exports = router;
