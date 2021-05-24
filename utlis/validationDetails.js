const randomMobile = require("random-mobile");
const randomEmail = require("random-email");
const randomUserName = require("random-username-generator");

const validation = () => {
  return {
    name: randomUserName.generate(),
    email: randomEmail(),
    phonenumber: "+91" + randomMobile(),
  };
};

module.exports = validation;
