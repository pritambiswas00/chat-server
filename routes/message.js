const fetch = require("node-fetch");
const express = require("express");
const router = express.Router();
const validateDetails = require("../utlis/validationDetails");
const {
  createContact,
  createConversation,
  sendMessage,
} = require("../APIUtils/APIUtils");
const { saveContact } = require("../utlis/clientSideComponents");

router.post("/sendMessage", async (req, res) => {
  const { conversationid, type, message } = req.body;
  try {
    const response = await sendMessage(message, conversationid, type);
    res.status(200).json({ success: true, response: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("/createconversation", async (req, res) => {
  const { message } = req.body;
  const randomDetails = validateDetails(); ///generating random details
  try {
    const { payload } = await createContact(
      randomDetails.name,
      randomDetails.email,
      randomDetails.phonenumber
    );
    const { contact, contact_inbox } = payload; ///Extracting the payload  for saving in the clients
    const conversation = await createConversation(payload);
    const { meta, id, messages } = conversation;
    const { assignee } = meta;

    const newClient = {
      name: contact.name,
      email: contact.email,
      phonenumber: contact.phone_number,
      conversationid: messages[0].conversation_id,
      sourceid: contact_inbox.source_id,
      clientid: contact.id,
      agentDetails: meta.assignee,
    };
    const contactSave = await saveContact(newClient); ///saving the contact in the DB
    const messageSend = await sendMessage(
      message,
      contactSave.conversationid,
      "incoming"
    );

    res.status(200).json({
      success: true,
      save: contactSave,
      msg: messageSend,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }

  ///creating the contact in the chatwoot.

  /// creating the conversation in the chatwoot.

  //

  // const clientMessageDetails = {
  //   newClient,
  //   assignee,
  //   messageSend,
  // };
});

module.exports = router;
