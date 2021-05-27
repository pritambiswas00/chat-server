const express = require("express");
const app = express();
const router = express.Router();
const {
  getAgent,
  getClient,
  conversationJoin,
} = require("../utlis/agentSideComponents");

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
  const {
    id,
    content,
    created_at,
    sender,
    conversation,
    meta,
    agent_last_seen_at,
    contact_last_seen_at,
    timestamp,
  } = req.body;
  console.log(sender.type);
  if (sender.type === "contact") {
    const messageDetails = {
      messageid: id,
      clientname: sender.name,
      conversationid: conversation.id,
      agentname: meta.assignee.name,
      clientid: conversation.contact_inbox.id,
      agentid: meta.assignee.id,
      message: content,
      timestamp: timestamp,
    };
    const respectiveAgent = getAgent(messageDetails.agentid);
    if (respectiveAgent) {
      const { sockethandle } = respectiveAgent;
      sockethandle.emit("message", messageDetails);
    }
  } else if (sender.type === "user") {
    const messageDetails = {
      messageid: id,
      conversationid: conversation.id,
      agentname: sender.name,
      clientid: conversation.contact_inbox.id,
      agentid: sender.id,
      message: content,
      timestamp: timestamp,
    };
    const client = getClient(messageDetails.clientid);
    if (client) {
      const { sockethandle } = client;
      sockethandle.emit("message", messageDetails);
    }
  }
});

module.exports = router;
