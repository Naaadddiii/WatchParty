import { log } from "../utils/logger.js";

let userCount = 0;

let videoState = {
  url: "",
  isPlaying: false,
  currentTime: 0,
};

export default function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    userCount++;
    log(`User connected: ${socket.id} | Total users: ${userCount}`);
    io.emit("userCount", userCount);
    socket.emit("syncState", videoState);

    // ---------------------------
    //  VIDEO CONTROL EVENTS
    // ---------------------------

    // When a user presses "Play"
    socket.on("play", (time) => {
      videoState.isPlaying = true;
      videoState.currentTime = time;
      log(`▶️ Play at ${time.toFixed(2)}s`);
      io.emit("play", time);
    });

    // When a user presses "Pause"
    socket.on("pause", (time) => {
      videoState.isPlaying = false;
      videoState.currentTime = time;
      log(`⏸️ Pause at ${time.toFixed(2)}s`);
      io.emit("pause", time);
    });

    // When a user seeks to a new position in the video
    socket.on("seek", (time) => {
      videoState.currentTime = time;
      log(`⏩ Seek to ${time.toFixed(2)}s`);
      io.emit("seek", time);
    });

    // ---------------------------
    //  CHAT EVENT
    // ---------------------------

    // When a user sends a chat message
    socket.on("chatMessage", (data) => {
      io.emit("chatMessage", data);
    });

    // ---------------------------
    //  VIDEO CHANGE EVENT
    // ---------------------------

    // When a user loads or pastes a new YouTube video link
    socket.on("changeVideo", (url) => {
      videoState.url = url;
      videoState.currentTime = 0;
      videoState.isPlaying = false;

      log(`🎞️ Video changed: ${url}`);

      // Broadcast new video URL to everyone, so all load the same video
      io.emit("changeVideo", url);
    });

    // ---------------------------
    //  DISCONNECT EVENT
    // ---------------------------

    // When a user disconnects (closes tab or loses connection)
    socket.on("disconnect", () => {
      userCount--;
      log(`User disconnected: ${socket.id} | Total users: ${userCount}`);
      io.emit("userCount", userCount);
    });
  });
}
