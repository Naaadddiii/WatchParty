import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import registerSocketHandlers from "./socket/index.js";
import { log } from "./utils/logger.js";

dotenv.config();

const app = express();

const allowedOrigins = process.env.ORIGIN?.split(",") || [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  log(`New socket connected: ${socket.id}`);
});

registerSocketHandlers(io);

// Test route for quick checks
app.get("/", (req, res) => res.send("WatchParty backend is running"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => log(`Server running on port ${PORT}`));
