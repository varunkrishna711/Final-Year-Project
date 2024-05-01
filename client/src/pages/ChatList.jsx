import React, { useEffect } from "react";
import { ChatItem, ChatList as List } from "react-chat-elements";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadChatList } from "../store/chatSlice";
import { openLoginModal, openSignUpModal } from "../store/modalSlice";
import "../styles/pages/chat.scss";

const ChatList = ({ isAdmin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.user.isLogin);
  const isAdminLogin = useSelector((state) => state.admin.isAdminLogin);
  const userId = useSelector((state) => state.user.userId);
  const chatList = useSelector((state) => state.chat.chatList);
  const adminId = useSelector((state) => state.admin.adminInfo?._id);

  const toLogin = () => {
    dispatch(openLoginModal());
  };

  const toSignUp = () => {
    dispatch(openSignUpModal());
  };

  useEffect(() => {
    if (isAdmin ? isAdminLogin : isLogin) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(
            loadChatList({
              latitude,
              longitude,
              userId: isAdmin ? adminId : userId,
              isAdmin,
            })
          );
        },
        (error) => {
          console.error("Error getting geolocation:", error.message);
        }
      );
    }
  }, []);

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
    <div className="py-4 px-8 min-h-[600px]">
      {chatList?.map((chat) => (
        <ChatItem
          id={chat.userId}
          avatar={chat.avatar}
          alt={chat.alt}
          title={chat.title}
          subtitle={chat.subtitle}
          date={chat.date}
          unread={chat.unread}
          onClick={() => navigate(`../chat/${chat.userId}`)}
        />
      ))}
    </div>
  );
};

export default ChatList;
