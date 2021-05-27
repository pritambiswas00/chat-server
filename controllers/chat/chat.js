const fetch = require("node-fetch");
const Users = require("../../Model/usersModel");
require("dotenv").config({ path: "../config/config.env" });
const moment = require("moment");
const { getAllClients } = require("../../utlis/agentSideComponents");

const chatController = {
  //////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////
  getAllConversation: async (req, res) => {
    const { agentid } = req.body;
    try {
      const getAgent = await Users.findOne({
        id: agentid,
      });
      if (!getAgent) {
        return res
          .status(404)
          .json({ success: false, error: "Agent is not in the database." });
      }
      const { access_token, account_id } = getAgent;
      const setting = {
        headers: {
          "Content-Type": "application/json",
          api_access_token: access_token,
        },
      };
      const response = await fetch(
        `https://app.chatwoot.com/api/v1/accounts/${account_id}/conversations`,
        setting
      );

      const conversations = await response.json();
      const { data } = conversations;
      const { payload } = data;
      const arrayConversation = payload;
      const sortArray = arrayConversation.map((item) => {
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
            createdAt: moment
              .unix(item.messages[0].created_at)
              .format("MM/DD/YYYY hh:mm a"),
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
      const getAgent = await Users.findOne({ id: agentid });
      if (!getAgent) {
        return res
          .status(404)
          .json({ success: false, error: "Agent is not in the database." });
      }
      const { access_token, account_id } = getAgent;
      const setting = {
        headers: {
          "Content-Type": "application/json",
          api_access_token: access_token,
        },
      };

      const response = await fetch(
        `https://app.chatwoot.com/api/v1/accounts/${account_id}/conversations/${conversationid}/messages`,
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
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  getAllConversationBySort: async (req, res) => {
    try {
      const { agentid } = req.params;
      const getAgent = await Users.findOne({ id: agentid });
      if (!getAgent) {
        return res.status(404).json({
          success: false,
          error: "Agent is not exist in the Database. Kindly signup",
        });
      }
      const { access_token, account_id } = getAgent;
      const setting = {
        headers: {
          "Content-Type": "application/json",
          api_access_token: access_token,
        },
      };
      let query;
      let url;
      let responseValue;
      if (req.query.status === "open") {
        query = "open";
        url = `https://app.chatwoot.com/api/v1/accounts/${account_id}/conversations?status=${query}&assignee_type=me`;
        const response = await fetch(url, setting);
        const getConversation = await response.json();
        const { data } = getConversation;
        const { meta, payload } = data;
        const arrayOfConversations = payload;

        const sort = arrayOfConversations.map((item) => {
          return (conversationDetails = {
            sender: {
              name: item.meta.sender.name,
              id: item.meta.sender.id,
            },
            conversation: {
              id: item.id,
              assignee: item.meta.assignee,
              lastmessage: item.messages[0].content,
              createdAt: moment
                .unix(item.messages[0].created_at)
                .format("MM/DD/YYYY hh:mm a"),
              client_last_activity: moment
                .unix(item.meta.sender.last_activity_at)
                .format("MM/DD/YYYY hh:mm a"),
            },
          });
        });

        responseValue = sort;
      } else if (req.query.status === "resolved") {
        query = "resolved";
        url = `https://app.chatwoot.com/api/v1/accounts/${account_id}/conversations?status=${query}&assignee_type=me`;
        const response = await fetch(url, setting);
        const getConversation = await response.json();
        const { data } = getConversation;
        const { meta, payload } = data;
        const arrayOfConversations = payload;

        const sort = arrayOfConversations.map((item) => {
          return (conversationDetails = {
            sender: {
              name: item.meta.sender.name,
              id: item.meta.sender.id,
            },
            conversation: {
              id: item.id,
              assignee: item.meta.assignee,
              lastmessage: item.messages[0].content,
              createdAt: moment
                .unix(item.messages[0].created_at)
                .format("MM/DD/YYYY hh:mm a"),
              client_last_activity: moment
                .unix(item.meta.sender.last_activity_at)
                .format("MM/DD/YYYY hh:mm a"),
            },
          });
        });
        responseValue = sort;
      } else if (req.query.status === "all") {
        query = "all";
        url = `https://app.chatwoot.com/api/v1/accounts/${account_id}/conversations?assignee_type=me`;
        const response = await fetch(url, setting);
        const getConversation = await response.json();
        const { data } = getConversation;
        const { meta, payload } = data;
        const arrayOfConversations = payload;
        const sort = arrayOfConversations.map((item) => {
          return (conversationDetails = {
            sender: {
              name: item.meta.sender.name,
              id: item.meta.sender.id,
            },
            conversation: {
              id: item.id,
              assignee: item.meta.assignee,
              lastmessage: item.messages[0].content,
              createdAt: moment
                .unix(item.messages[0].created_at)
                .format("MM/DD/YYYY hh:mm a"),
              client_last_activity: moment
                .unix(item.meta.sender.last_activity_at)
                .format("MM/DD/YYYY hh:mm a"),
            },
          });
        });

        responseValue = sort;
      }

      res.status(200).json({
        success: true,
        data: responseValue,
        length: responseValue.length,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  },
  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  conversationToggleStatus: async (req, res) => {
    const { agentid, conversationid } = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["conversationstatus"];
    const checkValidBody = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!checkValidBody) {
      return res.status(404).json({
        success: false,
        error: "The value should be conversationstatus",
      });
    }
    try {
      const { conversationstatus } = req.body;
      const getAgent = await Users.findOne({ id: agentid });
      if (!getAgent) {
        return res.status(404).json({
          success: false,
          error: "Agent is not exist in the Database. Kindly signup",
        });
      }
      const { access_token, account_id } = getAgent;
      const setting = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_access_token: access_token,
        },
        body: JSON.stringify({
          status: conversationstatus,
        }),
      };
      const response = await fetch(
        `https://app.chatwoot.com/api/v1/accounts/${account_id}/conversations/${conversationid}/toggle_status`,
        setting
      );
      const checkResponse = await response.json();
      res.status(200).json({ success: true, data: checkResponse });
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  agentStatusController: async (req, res) => {
    const update = Object.keys(req.body);
    const allowedUpdate = ["availability_status"];
    const checkStatus = update.every((item) => allowedUpdate.includes(item));
    if (!checkStatus) {
      return res
        .status(404)
        .json({ success: false, error: "body must be availability_status" });
    }
    const { agentid } = req.params;
    const getAgent = await Users.findOne({ id: agentid });
    if (!getAgent) {
      return res.status(404).json({
        status: false,
        error: "Agent is not exist in the Database. Kindly signup",
      });
    }
    const updateValue = Object.values(req.body);
    const allowedValue = ["online", "offline", "busy"];
    const checkStatusValue = updateValue.every((item) =>
      allowedValue.includes(item)
    );
    if (!checkStatusValue) {
      return res
        .status(404)
        .json({ success: false, error: "Please provide valid status" });
    }

    update.forEach((value) => (getAgent[value] = req.body[value]));
    await getAgent.save();

    const allAgentClients = getAllClients(agentid);
    allAgentClients.map((client) => {
      const { sockethandle } = client;
      sockethandle.emit("status", getAgent.availability_status);
    });

    res.status(200).json({
      success: true,
      message: "Agent Status Has Changed",
      agent: getAgent,
    });
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////
  agentStatusCheck: async (req, res) => {
    try {
      const { agentid } = req.params;
      const agent = await Users.findOne({ id: agentid });
      if (!agent) {
        return res.status(404).json({
          success: false,
          error: "Agent is not exist in the database",
        });
      }

      const agentStatus = agent.availability_status;
      res.status(200).json({ success: true, data: agentStatus });
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  },
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  availableAgents: async (req, res) => {
    try {
      const availableagents = await Users.find({
        availability_status: "online",
      });
      if (availableagents.length === 0) {
        return res.status(400).json({
          success: false,
          message: "There's no available agents currently available.",
        });
      }

      res
        .status(200)
        .json({ success: true, availableagents: availableagents.length });
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  },
};

module.exports = chatController;
