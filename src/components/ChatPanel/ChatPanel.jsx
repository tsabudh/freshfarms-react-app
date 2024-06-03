import React, { useContext, useEffect, useRef, useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { IoSendSharp } from 'react-icons/io5';
import { FaUserFriends } from 'react-icons/fa';
import classNames from 'classnames/bind';

import { AuthContext } from '../../context/AuthContext';
import { WS_ROUTE } from '../../assets/globals/baseRoute';
import styles from './ChatPanel.module.scss';

import fetchMyDetails from '../../utils/fetchMyDetails';
import { fetchAdmins } from '../../utils/fetchAdmins';
import fetchMessages from '../../utils/fetchMessages';
// import  WebSocket  from 'ws';
const cx = classNames.bind(styles);

class ChatMessage {
    constructor(sender, recipient, message, messageId) {
        this.type = 'message';
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
    const { jwtToken } = useContext(AuthContext);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [websocket, setWebsocket] = useState(null);
    const ws = useRef(null);
    const [currentUser, setCurrentUser] = useState('');
    const [recipient, setRecipient] = useState('');

    const [friends, setFriends] = useState(null);
    const [profile, setProfile] = useState(null);
    const [activeFriend, setActiveFriend] = useState(null);
    const [areFriendsHidden, setAreFriendsHidden] = useState(false);

    const connectWebSocket = () => {
        const newWebSocket = new WebSocket(WS_ROUTE);

        newWebSocket.onopen = (event) => {
            const registerMessage = {
                type: 'register',
                sender: profile._id,
                messageId: Date.now(),
            };
            newWebSocket.send(JSON.stringify(registerMessage));
        };
        newWebSocket.onmessage = (event) => {
            const newData = JSON.parse(event.data);

            switch (newData.type) {
                case 'message':
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        newData,
                        // newData.message,
                    ]);
                    break;
                case 'ack':
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        newData,
                        // newData.message,
                    ]);
                    setInput('');
                    break;
            }
        };
        newWebSocket.onerror = (error) => {};
        newWebSocket.onclose = (event) => {};

        setWebsocket(newWebSocket);
    };

    async function getSetAdminProfile() {
        const response = await fetchMyDetails(jwtToken);
        if (response.status == 'success') {
            setProfile(response.data);
        } else {
        }
    }

    useEffect(() => {
        let functionToFetchMessages = async () => {
            try {
                let result = await fetchMessages(jwtToken);
                setMessages(result);
            } catch (error) {}
        };
        functionToFetchMessages();
    }, []);
    useEffect(() => {
        connectWebSocket();

        // Cleanup on component unmount
        return () => {
            if (websocket) {
                websocket.close();
            }
        };
    }, [profile]);

    async function getSetFriends() {
        const response = await fetchAdmins(jwtToken);
        if (response.status == 'success') {
            setFriends(response.data);
        } else {
        }
    }
    useEffect(() => {
        getSetAdminProfile();
        getSetFriends();
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();

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
        <div className={cx('container')}>
            <div className={cx('chat-window')}>
                <section>
                    <div className={cx('title')}>
                        <h2>Chats</h2>
                        <div
                            className={cx('friends-menu')}
                            onClick={() => setAreFriendsHidden((prev) => !prev)}
                        >
                            <FaUserFriends />
                        </div>
                    </div>
                </section>
                {activeFriend ? (
                    <div className={cx('chat-box')}>
                        <div className={cx('chat-title')}>
                            <p className={cx('chat-name')}>
                                {activeFriend?.name}
                            </p>
                            <div
                                className={cx('close')}
                                onClick={() => setActiveFriend(null)}
                            >
                                <IoMdCloseCircle />
                            </div>
                        </div>
                        <div className={cx('message-window')}>
                            <div className={cx('messages')}>
                                {messages.map((data, index) => {
                                    const isSentByActiveFriend =
                                        data.sender == activeFriend._id;

                                    if (isSentByActiveFriend) {
                                        return (
                                            <div
                                                key={index}
                                                className={cx(
                                                    'message',
                                                    data.type == 'message'
                                                        ? 'received'
                                                        : 'sent'
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
                            <div className={cx('input-window')}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    // onKeyDown={(e) => {
                                    //     if (e.key === 'Enter') sendMessage();
                                    // }}
                                />
                                <button
                                    type="submit"
                                    onClick={(e) => sendMessage(e)}
                                >
                                    <IoSendSharp />
                                </button>
                            </div>
                        </form>
                    </div>
                ) : null}
            </div>

            <div className={cx('friends-window', { hidden: areFriendsHidden })}>
                {friends?.map((admin) => {
                    if (admin && admin._id != profile?._id) {
                        return (
                            <div
                                key={`friends_random_string${admin._id}`}
                                className={cx(
                                    'friend',
                                    activeFriend?._id === admin._id
                                        ? 'active'
                                        : 'inactive'
                                )}
                                onClick={() => setActiveFriend(admin)}
                            >
                                {admin.name}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}
