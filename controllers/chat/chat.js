const fetch = require("node-fetch");
const Users = require("../../Model/usersModel");
require("dotenv").config({ path: "../config/config.env" });
const { ADMIN_USER, ADMIN_ASSIGN_INBOX } = require("../../static");
const moment = require("moment");

const chatController = {
  //////////////////////////////////////////////////////////////////////////////////////////////
  getAllConversation: async (req, res) => {
    const { agentid } = req.body;
    try {
      const { access_token } = await Users.findOne({
        id: agentid,
      });
      const setting = {
        headers: {
          "Content-Type": "application/json",
          api_access_token: access_token,
        },
      };
      const response = await fetch(
        `https://app.chatwoot.com/api/v1/accounts/${ADMIN_USER.account_id}/conversations`,
        setting
      );

      const conversations = await response.json();
      const { data } = conversations;
      const { payload } = data;
      const sortArray = payload.map((item) => {
        return (conversationDetails = {
          sender: {
            name: item.meta.sender.name,
            id: item.meta.sender.id,
          },
          conversation: {
            id: item.id,
            assignee: item.meta.assignee,
            assigneeid: item.meta.assignee.id,
            lastmessage: item.messages[0].content,
            createdAt: moment.unix(item.messages[0].created_at).format(
              "MM/DD/YYYY hh:mm a"
            ),
          },
        });
      });

      const filterById = sortArray.filter((item) => {
        return item.conversation.assigneeid === agentid;
      });

      res.status(200).json({ success: true, conversation: filterById });
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  messageToSpecificConversation: async (req, res) => {
    const { agentid, conversationid } = req.body;
    try {
      const { access_token } = await Users.findOne({ id: agentid });

      const setting = {
        headers: {
          "Content-Type": "application/json",
          api_access_token: access_token,
        },
      };

      const response = await fetch(
        `https://app.chatwoot.com/api/v1/accounts/${ADMIN_USER.account_id}/conversations/${conversationid}/messages`,
        setting
      );

      const allMessages = await response.json();

      const { meta, payload } = allMessages;
      const sortArray = payload.map((item, index) => {
        return (messageDetails = {
          message: item.content,
          messageid: item.id,
          conversationid: item.conversation_id,
          createdAt: moment.unix(item.created_at).format("MM/DD/YYYY hh:mm a"),
          sender: item.sender || null,
        });
      });

      res.status(200).json({ success: true, data: sortArray });
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  },
};

module.exports = chatController;
