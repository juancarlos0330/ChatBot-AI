import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import socketIOClient from "socket.io-client";

// import config file
import { socketURL } from "./config/config";

// import component
import ChatBot from "./components/ChatBot";
import Admin from "./components/Admin/Admin";

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
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<ChatBot socket={socket} />} />
          <Route path="/admin" exact element={<Admin socket={socket} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
