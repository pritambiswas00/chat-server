const Clients = require("../Model/clientDetails");
const Users = require("../Model/usersModel");

///Sending the created contact to the end client

const saveContact = async (data) => {
  try {
    const createContact = new Clients({
      name: data.name,
      email: data.email,
      phonenumber: data.phonenumber,
      conversationid: data.conversationid,
      sourceid: data.sourceid,
      clientid: data.clientid,
      agentDetails: data.agentDetails,
    });

    await createContact.save();

    return createContact;
  } catch (error) {
    console.log(error);
  }
};

const findClients = async (conversationID) => {
  const isClientExist = await Clients.findOne({
    conversationid: conversationID,
  });
  if (!isClientExist) {
    return;
  }

  return isClientExist;
};

module.exports = {
  saveContact,
  findClients,
};

// sourceid = 40ff8bc3-0145-4d57-aa7b-0e47c86d751a
