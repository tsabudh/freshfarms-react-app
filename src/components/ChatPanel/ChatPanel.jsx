import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

import styles from './ChatPanel.module.scss';
import classNames from 'classnames/bind';
import fetchMyDetails from '../../utils/fetchMyDetails';
import { fetchAdmins } from '../../utils/fetchAdmins';
// import  WebSocket  from 'ws';
const cx = classNames.bind(styles);

class ChatMessage {
    constructor(sender, recipient, message, messageId) {
        this.type = 'ack';
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

    const connectWebSocket = () => {
        const newWebSocket = new WebSocket('ws://localhost:3000');

        newWebSocket.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        newWebSocket.onmessage = (event) => {
            console.log('NEW WEBSOCKET MESSAGE RECEIVED');
            const newData = JSON.parse(event.data);
            console.log(event);
            switch (newData.type) {
                case 'message':
                    console.log('received message.', newData.message);
                    console.log(messages);
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
        newWebSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        newWebSocket.onclose = (event) => {
            console.log('Closing newWebSocket connection.');
        };

        console.log(newWebSocket);
        setWebsocket(newWebSocket);
    };
    useEffect(() => {
        connectWebSocket();

        // Cleanup on component unmount
        return () => {
            if (websocket) {
                websocket.close();
            }
        };
    }, []);

    async function getSetAdminProfile() {
        const response = await fetchMyDetails(jwtToken);
        if (response.status == 'success') {
            setProfile(response.data);
        } else {
            console.log('Error fetching account s!');
        }
    }

    async function getSetFriends() {
        const response = await fetchAdmins(jwtToken);
        if (response.status == 'success') {
            console.log(response.data);
            setFriends(response.data);
        } else {
            console.log('Error fetching account s!');
        }
    }
    useEffect(() => {
        getSetAdminProfile();
        getSetFriends();
    }, []);

    const sendMessage = () => {
        if (websocket.readyState == 1 && input) {
            const chatMessage = new ChatMessage(
                profile._id,
                activeFriend._id,
                input,
                Date.now().toString()
            );
            websocket.send(JSON.stringify(chatMessage));
            // console.log(websocket);
            // console.log(JSON.stringify(chatMessage));
        } else {
            console.log('Websocket is not ready to send message.😢');
            connectWebSocket();
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('chat-window')}>
                <h1 className={cx('title')}> Chats</h1>
                {activeFriend ? (
                    <div className={cx('chat-box')}>
                        <p className={cx('chat-name')}>{activeFriend?.name}</p>
                        <div className={cx('message-window')}>
                            <div className={cx('messages')}>
                                {messages.map((data, index) => (
                                    <div
                                        key={index}
                                        className={cx(
                                            'message',
                                            data.sender == profile._id
                                                ? 'sent'
                                                : 'received'
                                        )}
                                    >
                                        {data.message}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={cx('input-window')}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') sendMessage();
                                }}
                            />
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    </div>
                ) : null}
            </div>

            <div className={cx('friends-window')}>
                {friends?.map((admin) => {
                    if (admin) {
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
