import classNames from "classnames/bind";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoSendSharp , IoCloseSharp , IoPeopleOutline } from "react-icons/io5";




import { AuthContextInterface } from "types/authContext.interface";
import { UserProfile } from "types/user.interface";
import styles from "./ChatPanel.module.scss";
import { WS_ROUTE } from "../../assets/globals/baseRoute";
import { AuthContext } from "../../context/AuthContext";

import fetchFriends from "../../utils/fetchFriends";
import fetchMessages from "../../utils/fetchMessages";
import fetchMyDetails from "../../utils/fetchMyDetails";
// import  WebSocket  from 'ws';
const cx = classNames.bind(styles);

class ChatMessage {
  type: string;
  sender: string;
  recipient: string;
  message: string;
  messageId: string;

  constructor(
    sender: string,
    recipient: string,
    message: string,
    messageId: string
  ) {
    this.type = "message";
    this.sender = sender;
    this.recipient = recipient;
    this.message = message;
    this.messageId = messageId;
  }

  // Method to get the message object
  getMessage() {
    return {
      type: this.type,
      sender: this.sender,
      recipient: this.recipient,
      message: this.message,
      messageId: this.messageId,
    };
  }
}



export default function ChatPanel() {
  const { jwtToken, user } = useContext<AuthContextInterface>(AuthContext);

  const messageWindowRef = useRef<HTMLDivElement  | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const ws = useRef(null);
  const [currentUser, setCurrentUser] = useState("");
  const [recipient, setRecipient] = useState("");

  const [friends, setFriends] = useState<string[] | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeFriend, setActiveFriend] = useState<UserProfile | null>(null);
  const [areFriendsHidden, setAreFriendsHidden] = useState(false);

  const [adminFriends, setAdminFriends] = useState<UserProfile[] | null>(null);
  const [customerFriends, setCustomerFriends] = useState<UserProfile[] | null>(null);

  const connectWebSocket = () => {
    const newWebSocket = new WebSocket(WS_ROUTE);

    newWebSocket.onopen = (event) => {
      const registerMessage = {
        type: "register",
        sender: profile?._id,
        messageId: Date.now(),
      };
      newWebSocket.send(JSON.stringify(registerMessage));
    };
    newWebSocket.onmessage = (event) => {
      const newData = JSON.parse(event.data);

      switch (newData.type) {
        case "message":
          setMessages((prevMessages:ChatMessage[]) => [...prevMessages, newData]);
          break;
        case "ack":
          setMessages((prevMessages) => [...prevMessages, newData]);
          setInput("");
          break;
      }
    };
    newWebSocket.onerror = (error) => {
      console.log(error);
    };
    newWebSocket.onclose = (event) => {};

    setWebsocket(newWebSocket);
  };

  async function getSetAdminProfile() {
  if(!jwtToken || !user) return;
    const response = await fetchMyDetails(jwtToken, user.role);
    if (response.status == "success") {
      setProfile(response.data);
    } else {
    }
  }
  async function getSetFriends() {
    try {
        if (!jwtToken || !user) throw new Error("No JWT token or user found");
        const friendsArray = await fetchFriends(jwtToken, user.role);
      if (friendsArray) {
        const [adminFriends, customerFriends] = friendsArray;
        const friendsTemp = [
          ...(adminFriends || []),
          ...(customerFriends || []),
        ];

        setFriends(friendsTemp);
        setAdminFriends(adminFriends || []);

        if (user.role === "admin") {
          setCustomerFriends(customerFriends || []);
        }
      }
    } catch (error:any) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    // Fetch previous messages of logged in user
    const functionToFetchMessages = async () => {
      try {
        const result = await fetchMessages(jwtToken);
        setMessages(result);
      } catch (error) {
        console.log(error);
      }
    };
    functionToFetchMessages();
  }, []);

  useEffect(() => {
    // Establish connection to websocket whenever profile(ie: user) changes
    connectWebSocket();

    // Cleanup on component unmount
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [profile]);

  useEffect(() => {
    getSetAdminProfile();
    getSetFriends();
  }, []);

  useEffect(() => {
    const content: HTMLElement | null = messageWindowRef.current;

    if (content) {
      const scrollToEnd = () => {
        content.scrollTo({
          top: content.scrollHeight,
        });
      };
      scrollToEnd();
    }
  }, [messages]);

  const sendMessage = (e:React.FormEvent) => {
    e.preventDefault();
    if (!websocket || !profile || !activeFriend) {
      console.error("WebSocket or profile or activeFriend is not set");
      return;
    }
    if (websocket.readyState == 1 && input) {
      const chatMessage = new ChatMessage(
        profile._id,
        activeFriend._id,
        input,
        Date.now().toString()
      );
      websocket.send(JSON.stringify(chatMessage));
    } else {
      connectWebSocket();
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("chat-window")}>
        <section className={cx("chat-header")}>
          <div className={cx("title")}>
            <h2>Chats</h2>
            <div
              className={cx("friends-menu", {
                closed: areFriendsHidden,
              })}
              onClick={() => setAreFriendsHidden((prev) => !prev)}
            >
              <IoPeopleOutline />
            </div>
          </div>
        </section>
        {activeFriend ? (
          <div className={cx("chat-box")}>
            <div className={cx("chat-title")}>
              <p className={cx("chat-name")}>{activeFriend?.name}</p>
              <div
                className={cx("close")}
                onClick={() => setActiveFriend(null)}
              >
                <IoCloseSharp />
              </div>
            </div>
            <div className={cx("message-window")} ref={messageWindowRef}>
              <div className={cx("messages")}>
                {messages.map((data, index) => {
                  const isSentByActiveFriend =
                    data.sender == activeFriend._id ||
                    data.recipient == activeFriend._id;

                  if (isSentByActiveFriend) {
                    return (
                      <div
                        key={index}
                        className={cx(
                          "message",
                          data.sender == activeFriend._id ? "received" : "sent"
                        )}
                      >
                        {data.message}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <form onSubmit={sendMessage}>
              <div className={cx("input-window")}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  // onKeyDown={(e) => {
                  //     if (e.key === 'Enter') sendMessage();
                  // }}
                />
                <button type="submit" onClick={(e) => sendMessage(e)}>
                  <IoSendSharp />
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>

      <div className={cx("friends-window", { hidden: areFriendsHidden })}>
        {adminFriends?.map((friend) => {
          if (friend && friend._id != profile?._id) {
            return (
              <div
                key={`friends_random_string${friend._id}`}
                className={cx(
                  "friend",
                  activeFriend?._id === friend._id ? "active" : "inactive"
                )}
                onClick={() => setActiveFriend(friend)}
              >
                {friend.name}
              </div>
            );
          }
        })}
        <div className={cx("hr")}></div>
        {customerFriends?.map((friend:UserProfile) => {
          if (friend && friend._id != profile?._id) {
            return (
              <div
                key={`friends_random_string${friend._id}`}
                className={cx(
                  "friend",
                  activeFriend?._id === friend._id ? "active" : "inactive"
                )}
                onClick={() => setActiveFriend(friend)}
              >
                {friend.name}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
