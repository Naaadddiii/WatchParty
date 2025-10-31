import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import registerSocketHandlers from "./socket/index.js";
import { log } from "./utils/logger.js";

dotenv.config();

const app = express();

// Convert comma-separated ORIGIN env var into an array
const allowedOrigins = process.env.ORIGIN?.split(",") || [];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  })
);

// Create HTTP server & bind Socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Register socket logic
registerSocketHandlers(io);

// Simple test endpoint
app.get("/", (req, res) => res.send("✅ WatchParty backend is running"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => log(`Server running on port ${PORT}`));
