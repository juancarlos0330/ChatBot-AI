import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineEnter } from "react-icons/ai";
import { FaArrowsRotate } from "react-icons/fa6";

// import styles
import "./ChatBot.scss";

// import assets
import chatBotImgUrl from "../assets/chatbot.svg";

const ChatBot = ({ socket }) => {
  const [flag, setFlag] = useState(false);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState([
    {
      flag: true,
      message: "I want to know how to work this site",
    },
    {
      flag: true,
      message: "Hi",
    },
    {
      flag: false,
      message:
        "Hello! How can I assist you today with LiveAgent? Hello! How can I assist you today with LiveAgent?",
    },
  ]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessage((prev) => [...prev, message]);
    });

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    const messageElement = document.getElementById("chatContent");
    if (messageElement) {
      messageElement.scrollTop =
        messageElement.scrollHeight - messageElement.clientHeight;
    }
  }, [message]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = () => {
    setInput("");
    if (input.trim() !== "") {
      const senderMsg = {
        flag: true,
        message: input,
      };
      socket.emit("sendMessage", senderMsg);
      setMessage((prev) => [...prev, senderMsg]);
    }
  };

  return (
    <div className="chatBot">
      <div className="chatBotSection">
        <img
          src="https://www.liveagent.com/app/themes/liveagent/assets/images/contact/chatbot.svg"
          className="chatBotImg"
          alt="chatBot"
          onClick={() => setFlag(true)}
        />

        {flag && (
          <div className="chatSection">
            <div className="chatHeader">
              <p className="chatHeaderTitle">Live Chat</p>
              <button className="closeBtn" onClick={() => setFlag(false)}>
                <AiOutlineClose style={{ fontSize: "20px" }} />
              </button>
            </div>
            <div className="chatContent" id="chatContent">
              {message.map((item, index) => {
                return item.flag ? (
                  <div className="senderMsg" key={index}>
                    {item.message}
                  </div>
                ) : (
                  <div className="receiverSection" key={index}>
                    <img
                      src={chatBotImgUrl}
                      alt="chatBot"
                      className="chatBotImg"
                    />
                    <div className="receiverMsg">{item.message}</div>
                  </div>
                );
              })}
            </div>
            <div className="chatFooter">
              <div className="chatSendSection">
                <button className="refreshBtn" onClick={() => alert("refresh")}>
                  <FaArrowsRotate style={{ fontSize: "16px" }} />
                </button>
                <input
                  type="text"
                  value={input}
                  placeholder="Ask me any questions..."
                  className="messageText"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className="sendBtn" onClick={sendMessage}>
                  <AiOutlineEnter style={{ fontSize: "16px" }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
