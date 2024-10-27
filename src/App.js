import React from "react";
import socketIOClient from "socket.io-client";

// import component
import ChatBot from "./components/ChatBot";

// import styles
import "./App.css";

// Socket.io connection
const socket = socketIOClient("http://85.208.110.183:5000"); // Change to your backend URL

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
