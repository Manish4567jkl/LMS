import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import app from "./app.js"; // Import the configured app

dotenv.config();
connectDB();

const server = http.createServer(app);

// WebSockets (Socket.io)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store connected users
const users = {};
const teachers = {};

io.on("connection", (socket) => {
  console.log(`⚡ User Connected: ${socket.id}`);

  socket.on("requestCall", ({ roomId, studentName }) => {
    console.log(`📞 ${studentName} is requesting a call in room ${roomId}`);
    if (teachers[roomId]) {
      io.to(teachers[roomId]).emit("incomingCall", { studentName, roomId });
    }
  });

  socket.on("teacherJoin", ({ roomId }) => {
    if (teachers[roomId]) return;
    teachers[roomId] = socket.id;
    socket.join(roomId);
    io.to(roomId).emit("teacherOnline", { roomId });
  });

  socket.on("join-room", ({ roomId, userId }) => {
    console.log(`👨‍🎓 User ${userId} joined room ${roomId}`);
    if (!users[roomId]) users[roomId] = [];
    if (!users[roomId].some((user) => user.userId === userId)) {
      users[roomId].push({ userId, socketId: socket.id });
    }
    socket.join(roomId);
    io.to(roomId).emit("user-connected", userId);
  });

  socket.on("acceptCall", ({ roomId }) => {
    io.to(roomId).emit("callAccepted");
  });

  socket.on("rejectCall", ({ roomId }) => {
    io.to(roomId).emit("callRejected");
  });

  socket.on("signal", (data) => {
    io.to(data.target).emit("signal", { from: data.from, signal: data.signal });
  });

  socket.on("disconnect", () => {
    console.log(`⚡ User Disconnected: ${socket.id}`);

    Object.keys(teachers).forEach((roomId) => {
      if (teachers[roomId] === socket.id) {
        delete teachers[roomId];
        io.to(roomId).emit("teacherOffline");
      }
    });

    Object.keys(users).forEach((roomId) => {
      users[roomId] = users[roomId].filter((user) => user.socketId !== socket.id);
      if (users[roomId]?.length === 0) delete users[roomId];
    });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
