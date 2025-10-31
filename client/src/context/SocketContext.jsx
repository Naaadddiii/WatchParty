import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   const newSocket = io(
  //     import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
  //   );
  //   setSocket(newSocket);
  //   return () => newSocket.disconnect();
  // }, []);
  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
    );
    newSocket.on("connect", () =>
      console.log("🟢 Socket connected:", newSocket.id)
    );
    newSocket.on("connect_error", (err) =>
      console.error("❌ Connection error:", err.message)
    );
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
