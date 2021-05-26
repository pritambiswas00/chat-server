const fetch = require("node-fetch");
const { ADMIN_USER, ADMIN_ASSIGN_INBOX } = require("../static");

const createContact = async (name, email, phonenumber) => {
  const Setting = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      api_access_token: ADMIN_USER.access_token,
    },
    body: JSON.stringify({
      inbox_id: ADMIN_ASSIGN_INBOX.id,
      name: name,
      email: email,
      phone_number: phonenumber,
    }),
  };

  const response = await fetch(
    `https://app.chatwoot.com/api/v1/accounts/${ADMIN_USER.account_id}/contacts`,
    Setting
  );
  const newContact = await response.json();
  if (!newContact) {
    throw new Error();
  }

  return newContact;
};

const createConversation = async (data) => {
  const Setting = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      api_access_token: ADMIN_USER.access_token,
    },
    body: JSON.stringify({
      source_id: data.contact_inbox.source_id,
      inbox_id: ADMIN_ASSIGN_INBOX.id,
      contact_id: data.contact.id,
      additional_attributes: {},
    }),
  };

  const response = await fetch(
    `https://app.chatwoot.com/api/v1/accounts/${ADMIN_USER.account_id}/conversations`,
    Setting
  );
  const conversation = await response.json();
  if (!conversation) {
    throw new Error();
  }

  return conversation;
};

const sendMessage = async (message, conversationId, type) => {
  const Setting = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      api_access_token: ADMIN_USER.access_token,
    },

    body: JSON.stringify({
      content: message,
      message_type: type,
      private: true,
      content_type: "text",
      content_attributes: {},
    }),
  };

  const response = await fetch(
    `https://app.chatwoot.com/api/v1/accounts/${ADMIN_USER.account_id}/conversations/${conversationId}/messages`,
    Setting
  );
  const messageResponse = await response.json();
  if (!messageResponse) {
    throw new Error();
  }
  return messageResponse;
};

module.exports = { createContact, createConversation, sendMessage };
