const express = require("express");
const router = express.Router();
const userController = require("../controllers/user/user");
const authentication = require("../middleware/authentication");

//@POST--> Sign Up///
///Email Address////
///password////

router.post("/signup", userController.userSignupController);

///POST --> Sign in///
///email Address///
///Password////

router.post("/signin", userController.userSignInController);

router.post("/signout", authentication, userController.userSignoutController);

router.post(
  "/signoutall",
  authentication,
  userController.userSignoutAllController
);

module.exports = router;
