import React, { useEffect } from "react";
import { ChatItem, ChatList as List } from "react-chat-elements";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadChatList, setChatList } from "../store/chatSlice";
import { openLoginModal, openSignUpModal } from "../store/modalSlice";
import PageLoader from "../components/loaders/PageLoader";
import "../styles/pages/chat.scss";

const ChatList = ({ isAdmin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.user.isLogin);
  const isAdminLogin = useSelector((state) => state.admin.isAdminLogin);
  const isLoading = useSelector((state) => state.chat.isLoading);
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

    return () => {
      dispatch(setChatList({ history: [], location: [] }));
    };
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
  if (isLoading)
    return (
      <div className="sm:h-[650px] flex flex-col justify-center items-center">
        <PageLoader />
      </div>
    );
  return (
    <div className="py-4 px-8 min-h-[600px]">
      {chatList?.history.length > 0 && (
        <>
          <h3 className="my-2">Recent</h3>
          {chatList?.history.map((chat) => (
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
        </>
      )}

      {chatList?.location.length > 0 && (
        <>
          <h3 className="mt-2">
            {isAdmin
              ? "Connect with more Vendors Nearby"
              : "Connect with more Producers Nearby"}
          </h3>
          {chatList?.location.map((chat) => (
            <ChatItem
              id={chat.userId}
              avatar={chat.avatar}
              alt={chat.alt}
              title={chat.title}
              subtitle={chat.subtitle}
              date={null}
              unread={chat.unread}
              onClick={() => navigate(`../chat/${chat.userId}`)}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ChatList;
