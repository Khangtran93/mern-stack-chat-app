import User from "../model/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../config/generateToken.js";

// @desc   Register User & provide token
// @route  POST /api/users
// @access PUBLIC

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, profilePicture } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(404);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    profilePicture,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User registration failed");
  }
});

// @desc   Auth user & provide token
// @route  POST /api/users/login
// @access PUBLIC
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill out all the fields");
  }

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Authentication failed");
  }
});

// @desc   Get users
// @route  GET /api/users
// @access PUBLIC
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  //req.user._id is what we get back from the protect middleware
  try {
    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .select("-password");
    res.json(users);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

export { registerUser, authUser, allUsers };
