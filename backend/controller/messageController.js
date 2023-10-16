import asyncHandler from "express-async-handler";
import Message from "../model/messageModel.js";
import User from "../model/userModel.js";
import Chat from "../model/chatModel.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data");
    res.status(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name profilePicture");

    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name profilePicture email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (err) {
    res.status(400).json(err);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name profilePicture email")
      .populate("chat");
    res.json(messages);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});
export { sendMessage, allMessages };
