import { useState } from "react";
import { Play, Pause, FastForward, Rewind } from "lucide-react";

export default function VideoControls({
  videoUrl,
  setVideoUrl,
  isPlaying,
  socket,
  playerRef,
}) {
  const [input, setInput] = useState(videoUrl);

  const handlePlay = () => {
    const time = playerRef.current?.getCurrentTime();
    socket.emit("play", time);
  };

  const handlePause = () => {
    const time = playerRef.current?.getCurrentTime();
    socket.emit("pause", time);
  };

  const handleSeek = (seconds) => {
    const time = playerRef.current?.getCurrentTime() + seconds;
    socket.emit("seek", time);
  };

  const handleChangeVideo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit("changeVideo", input);
    setVideoUrl(input);
  };

  return (
    <form
      onSubmit={handleChangeVideo}
      className="flex flex-col items-center gap-4 w-full"
    >
      {/* Input always visible */}
      <div className="flex w-full max-w-2xl gap-2">
        <input
          type="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste YouTube link here..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm md:text-base"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 transition"
        >
          <Play size={18} /> Load
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-5 mt-2">
        <button
          type="button"
          onClick={() => handleSeek(-5)}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 transition"
          aria-label="Rewind 5 seconds"
        >
          <Rewind size={20} />
        </button>

        {isPlaying ? (
          <button
            type="button"
            onClick={handlePause}
            className="p-4 bg-red-600 hover:bg-red-700 rounded-full text-white transition shadow-md"
          >
            <Pause size={22} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            className="p-4 bg-green-600 hover:bg-green-700 rounded-full text-white transition shadow-md"
          >
            <Play size={22} />
          </button>
        )}

        <button
          type="button"
          onClick={() => handleSeek(5)}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 transition"
          aria-label="Forward 5 seconds"
        >
          <FastForward size={20} />
        </button>
      </div>
    </form>
  );
}
