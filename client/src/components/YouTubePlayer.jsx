import YouTube from "react-youtube";
import { useRef, useState } from "react";

export default function YouTubePlayer({ videoUrl, onReady }) {
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = extractVideoId(videoUrl);

  const opts = {
    height: "480",
    width: "100%",
    playerVars: { autoplay: 0, controls: 0 },
  };

  const handleReady = (e) => {
    playerRef.current = e.target;
    onReady(playerRef);
    setIsLoading(false);
  };

  const handleBuffer = () => setIsLoading(true);

  return (
    <div className="w-full flex flex-col items-center justify-center relative">
      {videoId ? (
        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-700 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={handleReady}
            onBuffering={handleBuffer}
            className="w-full h-full"
          />
        </div>
      ) : (
        <div className="text-gray-400 italic text-center py-24">
          Paste a YouTube link to start watching together 🎥
        </div>
      )}
    </div>
  );
}
