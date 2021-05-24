const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../config/config.env" });

const UsersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    account_id: {
      type: Number,
      required: true,
    },
    access_token: {
      type: String,
      required: true,
    },
    available_name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar_url: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    pubsub_token: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    availability_status: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "online",
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UsersSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY);
  user.tokens = user.tokens.concat({ token: token });
  await user.save();
  return token;
};
UsersSchema.methods.getPublicData = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;
