import { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import { useSocket } from "../context/SocketContext";

export default function ChatBox() {
  const socket = useSocket();
  const [username, setUsername] = useState("");
  const [tempName, setTempName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("chatMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("chatMessage");
  }, [socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "" || !username) return;
    const msgData = { userId: username, message };
    socket.emit("chatMessage", msgData);
    setMessage("");
  };

  const handleSetName = (e) => {
    e.preventDefault();
    if (tempName.trim() === "") return;
    setUsername(tempName.trim());
  };

  return (
    <div className="w-full h-[500px] bg-gray-900/80 border border-gray-800 rounded-xl shadow-lg flex flex-col">
      {/* Username setup */}
      {!username ? (
        <form
          onSubmit={handleSetName}
          className="flex flex-col items-center justify-center flex-1 gap-3 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-200">
            Enter your name
          </h2>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Your name..."
            className="w-3/4 px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
          >
            Join Chat
          </button>
        </form>
      ) : (
        <>
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.userId === username ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                    msg.userId === username
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-200"
                  }`}
                >
                  {msg.userId !== username && (
                    <div className="text-xs text-gray-400 mb-1">
                      {msg.userId}
                    </div>
                  )}
                  <div>{msg.message}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input Area */}
          <form
            onSubmit={sendMessage}
            className="flex items-center border-t border-gray-800 bg-gray-950/70 p-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 text-gray-200 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="ml-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              <Send size={18} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
