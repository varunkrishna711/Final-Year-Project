import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "../components/MUI/ProgressBar";
import {
  loadMessages,
  setSelectedChat,
  setChats,
  sendTextMessage,
} from "../store/chatSlice";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import axios from "axios";
import { TextMessage } from "../components/chat/Message";
import "../styles/pages/chat.scss";
import { fetchUserInfo } from "../api/userApi";

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const isLoading = useSelector((state) => state.chat.isLoading);
  const chats = useSelector((state) => state.chat.chats);
  const selectedUserChat = useSelector((state) => state.chat.selectedChat);
  const userId = useSelector((state) => state.user.userId);

  const send = () => {
    dispatch(sendTextMessage({ userId, id, message })).then(() => {
      fetchMessages();
      setMessage("");
    });
  };

  const fetchMessages = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/chat/${userId}/${id}`)
      .then(async ({ data }) => {
        const body = await fetchUserInfo(id);
        dispatch(setSelectedChat(body));
        dispatch(setChats(data));
      });
  };

  useEffect(() => {
    /* USING REDUX */
    // const args = { from: userId, to: id };
    // console.log(args);
    // dispatch(loadMessages(args));

    /* TEMPORARY FIX */
    fetchMessages();
  }, [id, userId]);

  if (isLoading) return <ProgressBar />;
  return (
    <div className="sm:h-[650px] flex flex-col justify-center items-center">
      <div className="header w-9/12 min-w-[300px] h-12 my-4 bg-green-100 p-4 rounded-2xl flex items-center">
        <Avatar
          alt={selectedUserChat.firstname}
          src={
            selectedUserChat.image ??
            `https://api.dicebear.com/5.x/avataaars/svg?seed=${selectedUserChat.firstname}`
          }
        />
        <div
          onClick={() => navigate(`../../user/${selectedUserChat._id}`)}
          className="ml-2 cursor-pointer hover:text-green-900"
        >
          {selectedUserChat.firstname} {selectedUserChat.lastname}
        </div>
      </div>
      <div className="message-container h-auto p-8 overflow-auto chat-container w-9/12 min-w-[300px] ">
        {chats?.map((chat) => {
          switch (chat.type) {
            case "":
            case "":
            default:
              return (
                <TextMessage
                  id={chat._id}
                  message={chat.message.message}
                  isSent={chat.from._id == userId}
                  from={chat.from}
                  to={chat.to}
                  time={chat.createdAt}
                  unread={chat.isUnread}
                />
              );
          }
        })}
      </div>
      <div className="flex flex-row items-center justify-center w-9/12 h-auto gap-2 my-4">
        <input
          type="text"
          className="rounded-2xl bg-slate-200 w-[80%] h-12 px-6"
          placeholder="Type here..."
          onChange={(e) => setMessage(e.target.value)}
          autoFocus
          value={message}
        />
        <button
          type="send"
          onClick={send}
          className="flex items-center justify-center h-12 p-4 bg-green-400 rounded-2xl"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
