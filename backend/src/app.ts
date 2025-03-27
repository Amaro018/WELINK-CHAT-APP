import express from "express";
import { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import userRoutes from "./routes/users";
import messageRoutes from "./routes/message.routes";
import validateEnv from "./utils/validateEnv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { Server } from "socket.io";
import http from "http";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: validateEnv.FRONT_END_URL,
    credentials: true,
  })
);

const server = http.createServer(app);
// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: validateEnv.FRONT_END_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// io.on("connection", (socket) => {
//   console.log("🟢 New user connected: with socket id", socket.id);

//   socket.on("send_message", (message) => {
//     console.log("📩 New message received:", message);

//     // Broadcast the message to all connected clients (including the sender)
//     io.emit("receive_message", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 User disconnected:", socket.id);
//   });
// });
// const connectedUsers = new Map(); // Track users by socket ID

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("send_message", (message) => {
    console.log("📨 Message received:", message);

    socket.broadcast.emit("receive_message", message); // ✅ Broadcast full message
  });

  // socket.on("disconnect", () => {
  //   console.log("❌ User disconnected:", socket.id);
  // });

  // socket.on("user_join", (userId) => {
  //   connectedUsers.set(socket.id, userId);
  //   console.log(`👤 User ${userId} joined with socket ID: ${socket.id}`);
  // });

  // socket.on("send_message", (message) => {
  //   console.log("📩 Message received:", message);
  //   io.emit("receive_message", message);
  // });

  // socket.on("disconnect", () => {
  //   console.log("🔴 User disconnected:", socket.id);
  //   connectedUsers.delete(socket.id);
  // });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  next(createHttpError(404, "END POINT NOT FOUND"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "Something went wrong";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  // if (error instanceof Error) errorMessage = error.message;
  res.status(statusCode).json({ error: errorMessage });
});

export { app, server, io };
