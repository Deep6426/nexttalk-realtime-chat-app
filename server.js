const { createServer} = require("http");
const { Server } = require("socket.io");
require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");

const httpServer = createServer();

const io = new Server(httpServer, {  
    cors: {
        origin: "http://localhost:3000",
    },
});
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

const Message = mongoose.model("Message", MessageSchema);
console.log("Mongo URI:", process.env.MONGODB_URI);
console.log("Mongo URI exists:", !!process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Socket MongoDB connected"))
  .catch((err) => console.log(err));
io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("send-message", async (messageData) => {
  console.log("Message received:", messageData);

  try {
    await Message.create({
      username: messageData.username,
      text: messageData.text,
      room: messageData.room,
    });

    io.emit("receive-message", messageData);
  } catch (error) {
    console.log(error);
  }
});

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

httpServer.listen(3001, () => {
    console.log("Socket server running on port 3001");
});