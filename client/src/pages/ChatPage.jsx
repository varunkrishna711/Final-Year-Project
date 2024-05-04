import React, { useEffect, useRef, useState } from "react";
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
import {
  BidConfirmationMessage,
  TextMessage,
} from "../components/chat/Message";
import "../styles/pages/chat.scss";
import { fetchUserInfo } from "../api/userApi";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { openLoginModal, openSignUpModal } from "../store/modalSlice";

const ChatPage = ({ isAdmin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const isLoading = useSelector((state) => state.chat.isLoading);
  const chats = useSelector((state) => state.chat.chats);
  const selectedUserChat = useSelector((state) => state.chat.selectedChat);
  const userId = useSelector((state) => state.user.userId);
  const isLogin = useSelector((state) => state.user.isLogin);
  const isAdminLogin = useSelector((state) => state.admin.isAdminLogin);
  const adminId = useSelector((state) => state.admin.adminInfo?._id);

  const toLogin = () => {
    dispatch(openLoginModal());
  };

  const toSignUp = () => {
    dispatch(openSignUpModal());
  };

  const send = () => {
    dispatch(
      sendTextMessage({ userId: isAdmin ? adminId : userId, id, message })
    ).then(() => {
      fetchMessages();
      setMessage("");
    });
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const fetchMessages = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/chat/${
          isAdmin ? adminId : userId
        }/${id}`
      )
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
    if (isAdmin ? isAdminLogin : isLogin) fetchMessages();
    chats && scrollToBottom();
    return () => {
      dispatch(setSelectedChat(null));
      dispatch(setChats([]));
    };
  }, [id, isAdmin ? adminId : userId]);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  console.log(isAdmin ? adminId : userId, isAdmin);

  if (isLoading)
    return (
      <div className="sm:h-[650px] flex flex-col justify-center items-center">
        <ProgressBar />
      </div>
    );

  if (isAdmin ? !isAdminLogin : !isLogin)
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center">
        <div>
          <span onClick={toLogin} className="text-green-700 cursor-pointer">
            Login
          </span>{" "}
          or{" "}
          <span onClick={toSignUp} className="text-green-700 cursor-pointer">
            Sign Up
          </span>{" "}
          access chat
        </div>
      </div>
    );
  return (
    <div
      className={`${
        isAdmin ? "h-full" : "sm:h-[650px]"
      } flex flex-col justify-center items-center`}
    >
      {selectedUserChat && (
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
      )}
      <div
        className="message-container h-full p-8 overflow-auto chat-container w-9/12 min-w-[300px] "
        ref={containerRef}
      >
        {chats.length === 0 && (
          <div className="absolute flex items-center content-center gap-1 text-slate-600 top-1/2 left-1/2">
            <AnnouncementIcon />
            Such Empty
          </div>
        )}
        {chats?.map((chat) => {
          switch (chat.type) {
            case "":
            case "BID":
              return (
                <BidConfirmationMessage
                  chat={chat}
                  id={chat._id}
                  isSent={chat.from._id == (isAdmin ? adminId : userId)}
                />
              );
            default:
              return (
                <TextMessage
                  id={chat._id}
                  message={chat.message.message}
                  isSent={chat.from._id == (isAdmin ? adminId : userId)}
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
