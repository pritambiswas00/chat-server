const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: String,
      required: true,
    },
    messages: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Messages = mongoose.model("Messages", MessageSchema);

module.exports = Messages;
