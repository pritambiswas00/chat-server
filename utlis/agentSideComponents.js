const agents = [];

///Join all the available agents

const agentJoin = (id, agentInfo) => {
  const agent = { id, agentInfo };

  agents.push(agent);
  return agent;
};

const getAgent = (id) => {
  return agents.find((agent) => agent.agentInfo.id === id);
};

module.exports = {
  agentJoin,
  getAgent,
};
