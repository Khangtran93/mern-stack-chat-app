import express from "express";
import dotenv from "dotenv";
import chats from "./data/data.js";
import connectDB from "./config/db.js";
import userRoutes from "./Routes/userRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import colors from "colors";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user join room: " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    console.log("chat object ", chat);
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});

httpServer.listen(
  PORT,
  console.log(`Server running on Port ${PORT}`.yellow.bold)
);
