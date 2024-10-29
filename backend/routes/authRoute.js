const express = require("express");
const route = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userModel = require("../models/authModel");
const authMiddleware = require("../middleware/authMiddleware");

//auth/register
route.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (
      username.trim() === "" ||
      password.trim() === "" ||
      email.trim() === ""
    ) {
      return res.json({
        success: false,
        message:
          "Submitting blank fields? not exactly how this whole form thing works. But I admire the effort!",
      });
    }

    //validate fields
    if (!validator.isStrongPassword(password)) {
      return res.json({
        success: false,
        message:
          "password should have a minimum of 6 characters, at least one uppercase letter and special character.",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Invalid email format, try again...",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username: username,
      password: hashedPassword,
      email: email,
    });

    //token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
    res.status(200).json({
      success: true,
      message: "You solved the puzzle and are now one of us!",
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({
        success: false,
        message: "User already exists. Try a different username",
      });
    } else {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
});


//auth/login
route.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.json({
        success: false,
        message:
          "Wrong Username. Looks like your memory has a case of selective amnesia.",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.json({
        success: false,
        message: "Password does not match, try again...",
      });
    }

    //token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .json({ success: true, token, message: "Successfully logged in!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
});

//auth/username
route.get('/username', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if(!userId) {
      return res.json({success: false, message: "User Not Found. Try logging in again..."});
    }

    const user = await userModel.findById({_id: userId});
    res.json({success: true, user});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error fetching user"})
  }
})


module.exports = route;
