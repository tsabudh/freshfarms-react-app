import classNames from "classnames/bind";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoSendSharp, IoCloseSharp, IoPeopleOutline } from "react-icons/io5";

import type { AuthContextInterface } from "types/authContext.interface";
import type { UserProfile } from "types/user.interface";
import styles from "./ChatPanel.module.scss";
import { WS_ROUTE } from "../../assets/globals/baseRoute";
import { AuthContext } from "../../context/AuthContext";

import fetchFriends from "../../utils/fetchFriends";
import { fetchMessages } from "../../utils/fetchMessages";
import { fetchMyDetails } from "../../utils/fetchMyDetails";
import { simulateClickOnKeyDown } from "../../utils/utils";
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

  const messageWindowRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  // const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  const [, setFriends] = useState<string[] | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeFriend, setActiveFriend] = useState<UserProfile | null>(null);
  const [areFriendsHidden, setAreFriendsHidden] = useState(false);

  const [adminFriends, setAdminFriends] = useState<UserProfile[] | null>(null);
  const [customerFriends, setCustomerFriends] = useState<UserProfile[] | null>(
    null
  );

  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!WS_ROUTE || !user?._id) return;

    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let shouldReconnect = true;

    const connectWebSocket = () => {
      if (!WS_ROUTE) throw new Error("Fatal: WS_ROUTE not found!");

      const ws = new WebSocket(WS_ROUTE);
      websocketRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
        ws.send(
          JSON.stringify({
            type: "register",
            sender: user._id,
            messageId:  crypto.randomUUID(),
          })
        );
      };

      ws.onmessage = (event) => {
        const newData = JSON.parse(event.data);

        switch (newData.type) {
          case "message":
            setMessages((prevMessages) => [...prevMessages, newData]);
            break;
          case "ack":
            setMessages((prevMessages) => [...prevMessages, newData]);
            setInput("");
            break;
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error", error);
      };

      ws.onclose = () => {
        console.warn("🔌 WebSocket closed");

        if (shouldReconnect) {
          reconnectTimeout = setTimeout(() => {
            console.log("🔁 Reconnecting WebSocket...");
            connectWebSocket();
          }, 2000); // wait 2s before reconnecting
        }
      };
    };
    connectWebSocket();

    // Cleanup on unmount or user change
    return () => {
      console.log("Unmounting.")
      shouldReconnect = false;
      clearTimeout(reconnectTimeout);
      websocketRef.current?.close();
    };
  }, [user]);


  useEffect(() => {
    // Fetch past messages of logged in user
    const functionToFetchMessages = async () => {
      if (!jwtToken) return;
      try {
        const result = await fetchMessages(jwtToken);
        setMessages(result as unknown as ChatMessage[]);
      } catch (error) {
        console.log(error);
      }
    };
    functionToFetchMessages();
  }, [jwtToken]);

  useEffect(() => {
    (async () => {
      if (!(jwtToken && user)) return;
      const response = await fetchMyDetails(jwtToken, user.role);
      if (response.status == "success") {
        setProfile(response.data);
      }
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
    })();
  }, [jwtToken, user]);

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

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);
    if (!(websocketRef.current && profile && activeFriend)) {
      console.error("WebSocket or profile or activeFriend is not set");
      return;
    }
    if (websocketRef.current.readyState == 1 && input) {
      const chatMessage = new ChatMessage(
        profile._id,
        activeFriend._id,
        input,
        Date.now().toString()
      );
      websocketRef.current.send(JSON.stringify(chatMessage));
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("chat-window")}>
        <section className={cx("chat-header")}>
          <div className={cx("title")}>
            <h3>Chats</h3>
            <div
              className={cx("friends-menu", {
                closed: areFriendsHidden,
              })}
              onClick={() => setAreFriendsHidden((prev) => !prev)}
              tabIndex={0}
              role="button"
              onKeyDown={simulateClickOnKeyDown(() =>
                setAreFriendsHidden((prev) => !prev)
              )}
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
                onKeyDown={simulateClickOnKeyDown(() => setActiveFriend(null))}
                tabIndex={0}
                role="button"
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
                role="button"
                tabIndex={0}
                onKeyDown={simulateClickOnKeyDown(() =>
                  setActiveFriend(friend)
                )}
              >
                {friend.name}
              </div>
            );
          }
        })}
        <div className={cx("hr")}></div>
        {customerFriends?.map((friend: UserProfile) => {
          if (friend && friend._id != profile?._id) {
            return (
              <div
                key={`friends_random_string${friend._id}`}
                className={cx(
                  "friend",
                  activeFriend?._id === friend._id ? "active" : "inactive"
                )}
                onClick={() => setActiveFriend(friend)}
                role="button"
                tabIndex={0}
                onKeyDown={simulateClickOnKeyDown(() =>
                  setActiveFriend(friend)
                )}
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
