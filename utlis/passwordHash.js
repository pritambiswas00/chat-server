const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const encodePassword = await bcrypt.hash(password, 8);
  return encodePassword;
};

const comparePassword = async (password, hashPassword) => {
  const check = await bcrypt.compare(password, hashPassword);
  return check;
};

module.exports = {
  hashPassword,
  comparePassword,
};
