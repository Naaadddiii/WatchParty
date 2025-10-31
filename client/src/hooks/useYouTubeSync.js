import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

export default function useYouTubeSync(playerRef) {
  const socket = useSocket();
  const [videoUrl, setVideoUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!socket) return;

    socket.on("play", (time) => {
      if (playerRef.current) {
        playerRef.current.seekTo(time, true);
        playerRef.current.playVideo();
      }
      setIsPlaying(true);
    });

    socket.on("pause", (time) => {
      if (playerRef.current) {
        playerRef.current.seekTo(time, true);
        playerRef.current.pauseVideo();
      }
      setIsPlaying(false);
    });

    socket.on("seek", (time) => {
      if (playerRef.current) playerRef.current.seekTo(time, true);
      setCurrentTime(time);
    });

    socket.on("changeVideo", (url) => {
      setVideoUrl(url);
    });

    socket.on("syncState", (state) => {
      setVideoUrl(state.url);
      setIsPlaying(state.isPlaying);
      setCurrentTime(state.currentTime);
    });

    return () => {
      socket.off("play");
      socket.off("pause");
      socket.off("seek");
      socket.off("changeVideo");
      socket.off("syncState");
    };
  }, [socket]);

  return {
    socket,
    videoUrl,
    setVideoUrl,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
  };
}
