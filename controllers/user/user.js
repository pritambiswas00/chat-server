const Users = require("../../Model/usersModel");
const fetch = require("node-fetch");
const validator = require("validator");
const { hashPassword, comparePassword } = require("../../utlis/passwordHash");
const express = require("express");
const app = express();
const {
  userJoin,
  getAgent,
  agentLeaves,
  getClient,
} = require("../../utlis/agentSideComponents");

const userController = {
  userSignupController: async (req, res, next) => {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).json("Please provide a valid email address");
    } else if (email.trim().length === 0 || password.trim().length === 0) {
      return res.status(400).json("Fields cannot be empty");
    } else if (password.trim().length < 6) {
      return res
        .status(400)
        .json("Please provide atleast 6 characters of passoword.");
    }
    try {
      const setting = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      };
      const account = await fetch(
        "https://app.chatwoot.com/auth/sign_in",
        setting
      );
      const response = await account.json();

      const { data } = response;
      const isUserExist = await Users.findOne({ email: email });
      if (isUserExist) {
        return res.status(400).json({
          success: false,
          error: "email already exist in the database",
        });
      }
      const encodePassword = await hashPassword(password);
      const user = new Users({
        username: email,
        password: encodePassword,
        account_id: data.account_id,
        access_token: data.access_token,
        available_name: data.available_name,
        avatar_url: data.avatar_url,
        email: data.email,
        pubsub_token: data.pubsub_token,
        id: data.id,
        role: data.role,
        availability_status: data.availability_status,
      });
      const token = await user.generateAuthToken();
      await user.save();
      res.status(201).json({ user: user, token: token });
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  },
  ///////////////////////////////////////////////////////////////////////////////////////
  userSignInController: async (req, res, next) => {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).json("Please provide a valid email address");
    } else if (email.trim().length === 0 || password.trim().length === 0) {
      return res.status(400).json("Fields cannot be empty");
    } else if (password.trim().length < 6) {
      return res
        .status(400)
        .json("Please provide atleast 6 characters of passoword.");
    }
    try {
      const isUser = await Users.findOne({ email: email });
      if (!isUser) {
        return res.status(400).json({
          success: false,
          error: "User doesn't exist in the database.",
        });
      }
      const check = await comparePassword(password, isUser.password);
      if (!check) {
        return res
          .status(400)
          .json({ success: false, error: "Password is Incorrect" });
      }

      /////joining all the agent in the array
      const io = req.app.get("io");
      io.on("connection", (socket) => {
        console.log("new Agent has join");
        const agent = userJoin(socket, isUser.id);
        console.log(agent);
      });
      ///////////////////////////////////////////////////////////////////////////////
      const token = await isUser.generateAuthToken();
      res.status(200).json({ user: isUser.getPublicData(), token: token });
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  },
  /////////////////////////////////////////////////////////////////////////////////////////
  userSignoutController: async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token;
      });
      // const updateUser = await Users.findAndModify({
      //   query: { email: req.user.email },
      //   sort: { account_id: 3 },
      //   update: { availability_status: "offline" },
      // });
      // await updateUser.save();
      // const agent = getAgent(req.user.id);
      // if (agent) {
      //   agentLeaves(agent);
      //   const respectiveClient = getClientByAgentId(agentid);
      //   const { sockethandle, clientinfo } = respectiveClient;
      //   sockethandle.emit("signout", { clientinfo, status }); /////Informing the client that agent has signout while chating.///
      // }

      res
        .status(200)
        .json({ success: true, message: "You have successfully logout" });
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////
  userSignoutAllController: async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.status(200).json({
        success: true,
        message: "You have successfully logout from all devices.",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  },
};

module.exports = userController;
