import React from "react";
import socketIOClient from "socket.io-client";

// import component
import ChatBot from "./components/ChatBot";
import { socketURL } from "./config/config";

// import styles
import "./App.css";

// Socket.io connection
const socket = socketIOClient(socketURL); // Change to your backend URL

const App = () => {
  // useEffect(() => {
  //   socket.on("receiveMessage", (message) => {
  //     setMessages((prev) => [...prev, message]);
  //   });

  //   return () => {
  //     socket.off();
  //   };
  // }, []);

  return (
    <div className="App">
      <ChatBot socket={socket} />
    </div>
  );
};

export default App;
