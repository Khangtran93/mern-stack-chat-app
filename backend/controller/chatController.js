import asyncHandler from "express-async-handler";
import Chat from "../model/chatModel.js";
import User from "../model/userModel.js";

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("Userid not send with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatUser = await User.findById(userId);
    var chatData = {
      chatName: chatUser.name,
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name email pic",
        });
        res.status(200).json(result);
      });
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please fill out all the fields" });
  }

  const users = JSON.parse(req.body.users);

  // if (users.length < 2) {
  //   return res
  //     .status(400)
  //     .json({ message: "A group chat needs more than 2 people" });
  // }

  // users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.find({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(201).json(fullGroupChat);
    console.log(fullGroupChat);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName) {
    return res
      .status(400)
      .json("Please fill out all the fields to rename groupchat");
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const groupChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(groupChat);
    console.log(groupChat);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const remove = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(remove);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

export {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
