const jwt = require("jsonwebtoken");
const Users = require("../Model/usersModel");
require("dotenv").config({ path: "../config/config.env" });

const authentication = async (req, res, next) => {
  console.log("Middleware");
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decrypt = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decrypt);
    const user = await Users.findOne({
      _id: decrypt._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, error: "You are not authorized to access." });
  }
};

module.exports = authentication;
