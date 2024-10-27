import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineEnter } from "react-icons/ai";
import { FaArrowsRotate } from "react-icons/fa6";

// import component
import ClipboardCopy from "./ClipboardCopy";

// import styles
import "./ChatBot.scss";

// import assets
import chatBotImgUrl from "../assets/chatbot.svg";
import CodeBlock from "./CodeBlock";

const ChatBot = ({ socket }) => {
  const [flag, setFlag] = useState(false);
  const [email, setEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [input, setInput] = useState("");
  const [signFlag, setSignFlag] = useState(true);
  const [message, setMessage] = useState([
    {
      flag: false,
      message: "Hello! How can I assist you today?",
    },
  ]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignIn = () => {
    setEmailIsValid(validateEmail(email));
    if (validateEmail(email)) {
      setSignFlag(false);
    }
  };

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
            {signFlag ? (
              <div className="signSection">
                <div className="logoSection">
                  <div className="logoTitle">Sign In</div>
                  <div className="logoText">with Email</div>
                </div>
                <div className="emailSection">
                  <input
                    type="text"
                    className={`textInput ${emailIsValid ? "" : "textError"}`}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSignIn();
                      }
                    }}
                  />
                  {!emailIsValid && (
                    <p className="error-email">Please enter a valid email</p>
                  )}
                </div>
                <div className="signBtnSection" onClick={handleSignIn}>
                  <button className="signBtn">Sign In</button>
                </div>
              </div>
            ) : (
              <>
                <div className="chatContent" id="chatContent">
                  {message.map((item, index) => {
                    return item.flag ? (
                      <div className="senderMsg" key={index}>
                        {item.message
                          .split(/(?<=\.)\s*\n\n?/)
                          .map((section, index) => (
                            <div key={index} className="messagePart">
                              {section}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="receiverSection" key={index}>
                        <img
                          src={chatBotImgUrl}
                          alt="chatBot"
                          className="chatBotImg"
                        />
                        <ClipboardCopy message={item.message} />
                        <div className="receiverMsg">
                          {item.message.includes("```") ? (
                            item.message
                              .split("```")
                              .map((part, idx) => (
                                <CodeBlock key={idx} codeString={part} />
                              ))
                          ) : (
                            <>
                              {item.message
                                .split(/(?<=\.)\s*\n\n?/)
                                .map((section, index) => (
                                  <div key={index} className="messagePart">
                                    {section}
                                  </div>
                                ))}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="chatFooter">
                  <div className="chatSendSection">
                    <button
                      className="refreshBtn"
                      onClick={() => alert("refresh")}
                    >
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
