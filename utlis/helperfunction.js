const sortConversation = (arr) => {
  arr.map((item) => {
    return (conversationDetails = {
      sender: {
        name: item.meta.sender.name,
        id: item.meta.sender.id,
      },
      conversation: {
        id: item.id,
        assignee: item.meta.assignee,
      },
    });
  });
};

module.exports = sortConversation;
