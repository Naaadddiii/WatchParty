import { useRef, useState, useEffect } from "react";
import YouTubePlayer from "../components/YouTubePlayer";
import VideoControls from "../components/VideoControls";
import useYouTubeSync from "../hooks/useYouTubeSync";
import ChatBox from "../components/ChatBox";
import { Users, LayoutDashboard } from "lucide-react";

export default function Home() {
  const playerRef = useRef(null);
  const { socket, videoUrl, setVideoUrl, isPlaying } =
    useYouTubeSync(playerRef);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // --- Socket: connected users ---
  useEffect(() => {
    if (!socket) return;
    socket.on("userCount", (count) => setConnectedUsers(count));
    return () => socket.off("userCount");
  }, [socket]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleReady = (ref) => {
    playerRef.current = ref.current;
    setIsPlayerReady(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 flex flex-col items-center py-8 px-4 relative">
      {/* Header */}
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl backdrop-blur-md bg-gray-800/40 border border-gray-700/50 shadow-lg rounded-2xl px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-center sm:text-left transition-all duration-500 ${
          showHeader
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-center sm:justify-start gap-2 text-white font-semibold text-xl md:text-2xl">
          <LayoutDashboard className="w-6 h-6 text-blue-400" />
          <span>WatchParty</span>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center justify-center sm:justify-end gap-2 text-gray-300 text-sm bg-gray-900/50 px-4 py-1.5 rounded-full border border-gray-700/40 shadow-sm">
          <Users size={16} className="text-blue-400" />
          <span>
            Connected:{" "}
            <span className="font-semibold text-blue-400">
              {connectedUsers}
            </span>
          </span>
        </div>
      </header>

      <div className="h-24"></div>

      {/* Controls */}
      <div className="w-full max-w-7xl mb-6">
        <VideoControls
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          isPlaying={isPlaying}
          socket={socket}
          playerRef={playerRef}
        />
      </div>

      {/* Main Section*/}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6">
        <div className="rounded-2xl bg-gray-900/70 shadow-2xl border border-gray-800 backdrop-blur-md p-6 flex flex-col items-center justify-center">
          <YouTubePlayer videoUrl={videoUrl} onReady={handleReady} />
        </div>
        <div className="rounded-2xl bg-gray-900/80 border border-gray-800 shadow-lg p-4 flex flex-col h-full max-h-[600px] overflow-y-auto">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
