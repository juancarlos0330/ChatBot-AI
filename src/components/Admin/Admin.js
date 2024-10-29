import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AiOutlineEnter } from "react-icons/ai";

// import functions
import {
  adminSignIn,
  getUserListAPI,
  updateNotifyCount,
} from "../../actions/UserAction";
import { getChatHistory } from "../../actions/ChatAction";

// import components
import CodeBlock from "../CodeBlock";
import ClipboardCopy from "../ClipboardCopy";

// import assets
import chatBotImgUrl from "../../assets/chatbot.svg";
import signBtnLoadImgUrl from "../../assets/loading.gif";

// import styles
import "./Admin.scss";

const Admin = ({ socket }) => {
  const [signPageFlag, setSignPageFlag] = useState(true);
  const [email, setEmail] = useState("");
  const [userActiveEmail, setUserActiveEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [userList, setUserList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [signLoadingFlag, setSignLoadingFlag] = useState(false);
  const [input, setInput] = useState("");

  const getUserList = async () => {
    setLoadingFlag(true);
    const res = await getUserListAPI();
    if (res.data.success) {
      setLoadingFlag(false);
      setUserList(res.data.result);
    } else {
      setLoadingFlag(false);
    }
  };

  useEffect(() => {
    socket.on("private-message", (message) => {
      console.log(message);
      if (userActiveEmail === message.email) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("notifyToAdmin", (res) => {
      console.log("notify");
      if (res === "update") {
        getUserList();
      }
    });

    return () => {
      socket.off();
    };
  }, [userActiveEmail]);

  const handleItemClick = async (index, email, notifyCount) => {
    setActiveIndex(index);
    setLoadingFlag(true);
    setMessages([]);
    setUserActiveEmail(email);
    const updateResult = await updateNotifyCount(email);
    if (updateResult.data.success) {
      const res = await getUserListAPI();
      if (res.data.success) {
        setUserList(res.data.result);
      }
    }

    const results = await getChatHistory(email);
    if (results.data.success) {
      setLoadingFlag(false);
      setMessages(results.data.result);
    } else {
      setLoadingFlag(false);
    }
  };

  // when the messages are updated, scroll to the bottom
  useEffect(() => {
    const messageElement = document.getElementById("chatContent");
    if (messageElement) {
      messageElement.scrollTop =
        messageElement.scrollHeight - messageElement.clientHeight;
    }
  }, [messages]);

  // check if token is expired
  useEffect(() => {
    if (localStorage.getItem("jwtAdminToken")) {
      const decoded = jwtDecode(localStorage.getItem("jwtAdminToken"));
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("jwtAdminToken");
        setSignPageFlag(true);
      } else {
        setEmail(decoded.email);
        setSignPageFlag(false);
        getUserList();

        // UserJoined emit event to server
        socket.emit("userJoined", decoded.email);
      }
    }
  }, []);

  const handleSendMessage = () => {
    setInput("");
    if (input.trim() !== "") {
      const senderMsg = {
        flag: false,
        message: input,
        receiverEmail: userActiveEmail,
        email: userActiveEmail,
        botFlag: false,
      };
      socket.emit("private-message", senderMsg);
      setMessages((prev) => [...prev, senderMsg]);
    }
  };

  const handleSignIn = async () => {
    setSignLoadingFlag(true);
    if (email === "" && password === "") {
      setErrorEmail(true);
      setErrorPassword(true);
      setSignLoadingFlag(false);
    } else if (email !== "admin@admin.com") {
      setErrorEmail(true);
      setErrorPassword(false);
      setSignLoadingFlag(false);
    } else if (password !== "admin") {
      setErrorEmail(false);
      setErrorPassword(true);
      setSignLoadingFlag(false);
    } else {
      setErrorEmail(false);
      setErrorPassword(false);

      const res = await adminSignIn(email);
      if (res.data.success) {
        localStorage.setItem("jwtAdminToken", res.data.token);
        const decoded = jwtDecode(res.data.token);
        setEmail(decoded.email);
        setSignPageFlag(false);
        await getUserList();
        setSignLoadingFlag(false);
        // UserJoined emit event to server
        socket.emit("userJoined", decoded.email);
      } else {
        setSignPageFlag(true);
        setSignLoadingFlag(false);
      }
    }
  };

  return (
    <div className="AdminSection">
      {signPageFlag ? (
        <div className="adminSignSection">
          <div className={`textInputView ${!errorEmail ? "" : "hidden"}`}>
            <input
              type="text"
              value={email}
              placeholder="Email"
              className="textInput"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSignIn();
                }
              }}
            />
            {errorEmail && (
              <p className="error-message">Please enter a valid email</p>
            )}
          </div>
          <div className={`textInputView ${!errorPassword ? "" : "hidden"}`}>
            <input
              type="password"
              value={password}
              placeholder="Password"
              className="textInput"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSignIn();
                }
              }}
            />
            {errorPassword && (
              <p className="error-message">Password is not correct</p>
            )}
          </div>
          <div className="textInputView">
            <button type="button" className="signButton" onClick={handleSignIn}>
              {signLoadingFlag ? (
                <img
                  src={signBtnLoadImgUrl}
                  alt="loading"
                  className="signInButtonLoading"
                />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="adminChatSection">
          <div className="adminUserSection">
            {userList.map((item, index) => {
              return (
                <div
                  className={`userItem ${
                    activeIndex === index ? "userActive" : ""
                  }`}
                  key={index}
                  onClick={() =>
                    handleItemClick(index, item.email, item?.notifyCount)
                  }
                >
                  <img
                    alt="userAvatar"
                    src={
                      "https://api.dicebear.com/9.x/pixel-art/svg?seed=" +
                      item.email
                    }
                    className="userAvatar"
                  />
                  <p className="userName">{item.email}</p>
                  {Number(item?.notifyCount) !== 0 && (
                    <p className="notifyNum">{item?.notifyCount}</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="adminContentSection">
            {loadingFlag ? (
              <img
                src={signBtnLoadImgUrl}
                alt="loading"
                className="loadingChatContent"
              />
            ) : (
              <>
                <div className="chatContent" id="chatContent">
                  {messages.map((item, index) => {
                    return !item.flag ? (
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
                {messages.length > 0 && (
                  <div className="chatFooter">
                    <div className="chatSendSection">
                      <input
                        type="text"
                        placeholder={`Chat with ${userActiveEmail}`}
                        className="messageText"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                      />
                      <button className="sendBtn" onClick={handleSendMessage}>
                        <AiOutlineEnter style={{ fontSize: "16px" }} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
