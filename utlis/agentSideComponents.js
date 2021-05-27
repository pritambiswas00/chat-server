const agents = [];
const conversations = [];

///Join all the available agents

const userJoin = (sockethandle, agentid) => {
  const agent = { sockethandle, agentid };
  agents.push(agent);
  return agent;
};

const getAgent = (id) => {
  agents.find((agent) => {
    agent.agentid === id;
    return agent;
  });
};

const agentLeaves = (agentLeave) => {
  const index = agents.findIndex(
    (agent) => agent.agentid === agentLeave.agentid
  );
  if (index !== -1) {
    return agents.splice(index, 1)[0];
  }
};

const conversationJoin = (sockethandle, clientInfo) => {
  const client = { sockethandle, clientInfo };
  conversations.push(client);
  return client;
};

const getClient = (clientid) => {
  const checkClient = conversations.find(
    (client) => client.clientInfo.clientid === clientid
  );
  return checkClient;
};

const getAllClients = (agentid) => {
  return conversations.filter(
    (client) => client.clientInfo.agentid === agentid
  );
};

module.exports = {
  userJoin,
  getAgent,
  getClient,
  conversationJoin,
  agentLeaves,
  getAllClients,
};
