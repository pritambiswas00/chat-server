const mongoose = require("mongoose");

const randomemail = require("random-email");
const randomUsername = require("random-username-generator");
const randomnumber = require("random-mobile");

const ClientsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: randomUsername.generate(),
    },
    email: {
      type: String,
      default: randomemail(),
    },
    phonenumber: {
      type: String,
      default: "+91" + randomnumber(),
    },
    conversationid: {
      type: Number,
    },
    sourceid: {
      type: String,
      required: true,
    },
    clientid: {
      type: String,
      required: true,
    },
    agentDetails: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Clients = mongoose.model("Clients", ClientsSchema);

module.exports = Clients;
