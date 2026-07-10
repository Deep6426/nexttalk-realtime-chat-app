const express = require("express");
const app = express();

const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const onlineUsers = new Map();
const MessageSchema = new mongoose.Schema(
  {
    username: String,
    text: String,
    room: String,
  },
  {
    timestamps: true,
  }
);

const Message =
  mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
console.log("Mongo URI:", process.env.MONGODB_URI);
console.log("Mongo URI exists:", !!process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Socket MongoDB connected"))
  .catch((err) => console.log(err));
  app.get("/", (req, res) => {
  res.send("Socket Server Running");
});
io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    socket.on("user-online", (username) => {
    console.log(username, "is online");

    onlineUsers.set(username, socket.id);

    console.log("ONLINE USERS:", [...onlineUsers.keys()]);

    io.emit("online-users", [...onlineUsers.keys()]);
});
    let currentRoom = null;
    socket.on("join-room", (room) => {
    if (currentRoom) {
        socket.leave(currentRoom);
    }

    socket.join(room);
    currentRoom = room;

    console.log(`${socket.id} joined ${room}`);
});
  socket.on("typing", (data) => {
    console.log("SERVER RECEIVED TYPING:", data);
    io.emit("typing", data);
});
   socket.on("send-message", async (messageData) => {
  try {
    const message = await Message.create(messageData);

    io.emit("receive-message", message);
  } catch (err) {
    console.log(err);
  }
});

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3001;

console.log("PORT ENV =", process.env.PORT);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Socket server running on port ${PORT}`);
});