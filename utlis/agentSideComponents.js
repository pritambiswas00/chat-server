const agents = [];
const conversations = [];

///Join all the available agents

const userJoin = (sockethandle, agentid) => {
  const agent = { sockethandle, agentid };
  agents.push(agent);
};

const getAgent = async (id) => {
  return agents.find((agent) => {
    return agent.agentid === id;
  });
};

const conversationJoin = (sockethandle, clientInfo) => {
  const client = { sockethandle, clientInfo };
  conversations.push(client);
};

const getClient = (id) => {
  return conversations.find((client) => client.clientInfo.clientid === id);
};

module.exports = {
  userJoin,
  getAgent,
  getClient,
  conversationJoin,
};
