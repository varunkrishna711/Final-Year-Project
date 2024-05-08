import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useNavigate } from "react-router-dom";
import socket from "../../utils/socket";

const TextMessage = ({ id, message, from, to, time, unread, isSent }) => {
  const messageClass = isSent ? "flex justify-end" : "flex justify-start";
  const messageContainerClass = isSent
    ? "bg-green-200 rounded-ee-none"
    : "bg-gray-200 rounded-ss-none";
  const [isUnread, setUnRead] = useState(unread);

  const markAsRead = async () => {
    if (!isSent)
      await axios
        .put(`${process.env.REACT_APP_API_URL}/api/chat/mark-as-read/${id}`)
        .then(() => socket.emit("unread", id))
        .catch(() => console.log("mark as read api failed"));
  };

  const setRead = () => {
    setUnRead(false);
  };

  useEffect(() => {
    markAsRead();

    id && socket.emit("createChatRoom", id);
    socket.on("setRead", setRead);

    return () => {
      socket.off("setRead", setRead);
    };
  }, []);

  return (
    <div className={`flex items-start mb-2 ${messageClass}`}>
      {!isSent && (
        <Avatar
          alt={from.firstname}
          src={
            from.image ??
            `https://api.dicebear.com/5.x/avataaars/svg?seed=${from.firstname}`
          }
        />
      )}
      <div className={`p-2 rounded-2xl ml-2 ${messageContainerClass}`}>
        <p>{message}</p>
        <small className="mr-2">{convertDateFormat(time)}</small>

        {isSent &&
          (!isUnread ? (
            <DoneAllIcon className="!text-[18px]" />
          ) : (
            <DoneIcon className="!text-[18px]" />
          ))}
      </div>
      {isSent && (
        <Avatar
          alt={from.firstname}
          src={
            from.image ??
            `https://api.dicebear.com/5.x/avataaars/svg?seed=${from.firstname}`
          }
        />
      )}
    </div>
  );
};

const ProductRequestMessage = ({ id, chat, isSent }) => {
  const { from, to, time, isUnread, message } = chat;
  const navigate = useNavigate();
  const messageClass = isSent ? "flex justify-end" : "flex justify-start";
  const messageContainerClass = isSent
    ? "bg-green-200 rounded-ee-none"
    : "bg-gray-200 rounded-ss-none";

  const navigateToRequestPage = () => {
    if (isSent) navigate("../product-request-history");
    else navigate(`../requests/${message.request._id}`);
  };

  const [unread, setUnread] = useState(isUnread);

  const markAsRead = async () => {
    if (!isSent)
      await axios
        .put(`${process.env.REACT_APP_API_URL}/api/chat/mark-as-read/${id}`)
        .then(() => socket.emit("unread", id))
        .catch(() => console.log("mark as read api failed"));
  };

  const setRead = () => {
    setUnread(false);
  };

  useEffect(() => {
    markAsRead();

    socket.emit("createChatRoom", id);
    socket.on("setRead", setRead);

    return () => {
      socket.off("setRead", setRead);
    };
  }, []);
  return (
    <div className={`flex items-start mb-2 ${messageClass}`}>
      {!isSent && (
        <Avatar
          alt={from.firstname}
          src={
            from.image ??
            `https://api.dicebear.com/5.x/avataaars/svg?seed=${from.firstname}`
          }
        />
      )}{" "}
      <div className={`p-2 rounded-2xl ml-2 ${messageContainerClass}`}>
        <strong className="text-gray-600">Product Request</strong>
        <div>
          <h3 className="text-lg font-semibold">
            {message.request.itemRequired}
          </h3>
          <p className="text-gray-500">{`Quantity: ${message.request.quantityRequired}`}</p>
          <p className="text-gray-500">{`Delivery Date: ${message.request.toBeDeliveredOn}`}</p>
        </div>
        <small className="mr-2">
          {convertDateFormat(time ?? chat.createdAt)}
        </small>
        {isSent &&
          (!unread ? (
            <DoneAllIcon className="!text-[18px]" />
          ) : (
            <DoneIcon className="!text-[18px]" />
          ))}{" "}
        <div
          className="my-1 text-blue-600 cursor-pointer link"
          onClick={navigateToRequestPage}
        >
          {isSent ? "View request history" : "View request details"}
        </div>
      </div>
      {isSent && (
        <Avatar
          alt={from.firstname}
          src={
            from.image ??
            `https://api.dicebear.com/5.x/avataaars/svg?seed=${from.firstname}`
          }
        />
      )}{" "}
    </div>
  );
};

const BroadcastMessage = ({ id, chat, isSent }) => {
  const { from, to, createdAt: time, isUnread, message } = chat;
  const product = message.broadcast.product;
  const messageClass = isSent ? "flex justify-end" : "flex justify-start";
  const messageContainerClass = isSent
    ? "bg-green-200 rounded-ee-none"
    : "bg-gray-200 rounded-ss-none";
  const navigate = useNavigate();

  const [unread, setUnRead] = useState(isUnread);

  const markAsRead = async () => {
    if (!isSent)
      await axios
        .put(`${process.env.REACT_APP_API_URL}/api/chat/mark-as-read/${id}`)
        .then(() => socket.emit("unread", id))
        .catch(() => console.log("mark as read api failed"));
  };

  const setRead = () => {
    setUnRead(false);
  };

  const handleClick = () => {
    isSent
      ? navigate(`../products/${product._id}`)
      : navigate(`../product/${product._id}`);
  };

  useEffect(() => {
    markAsRead();

    socket.emit("createChatRoom", id);
    socket.on("setRead", setRead);

    return () => {
      socket.off("setRead", setRead);
    };
  }, []);

  return (
    <div className={`flex items-start mb-2 ${messageClass}`}>
      {!isSent && (
        <Avatar
          alt={from.firstname}
          src={
            from.image ??
            `https://api.dicebear.com/5.x/avataaars/svg?seed=${from.firstname}`
          }
        />
      )}
      <div className={`p-2 rounded-2xl ml-2 ${messageContainerClass}`}>
        <div className="p-2 rounded-lg">
          <strong className="text-gray-600">Broadcast Message</strong>
          <div className="flex items-center justify-start gap-2 mb-2">
            <div>
              <img
                src={product.images[0]}
                alt={product.name}
                className="object-cover w-20 h-20 rounded-lg"
              />
            </div>
            <div>
              <h3
                className="text-lg font-semibold cursor-pointer hover:underline"
                onClick={handleClick}
              >
                {product.name}
              </h3>
              <p className="text-gray-500">Price {`₹${product.price}`}</p>
            </div>
          </div>
          <p className="max-w-xs">{product.shortDescription}</p>
        </div>

        <small className="mr-2">{convertDateFormat(time)}</small>
        {isSent &&
          (!unread ? (
            <DoneAllIcon className="!text-[18px]" />
          ) : (
            <DoneIcon className="!text-[18px]" />
          ))}
      </div>
      {isSent && (
        <Avatar
          alt={from.firstname}
          src={
            from.image ??
            `https://api.dicebear.com/5.x/avataaars/svg?seed=${from.firstname}`
          }
        />
      )}
    </div>
  );
};

const BidConfirmationMessage = ({ id, chat, isSent }) => {
  const { from, to, createdAt, isUnread, message } = chat;
  const messageClass = isSent ? "flex justify-end" : "flex justify-start";
  const messageContainerClass = isSent
    ? "bg-green-200 rounded-ee-none"
    : "bg-gray-200 rounded-ss-none";

  const [unread, setUnRead] = useState(isUnread);

  const markAsRead = async () => {
    if (!isSent)
      await axios
        .put(`${process.env.REACT_APP_API_URL}/api/chat/mark-as-read/${id}`)
        .then(() => socket.emit("unread", id))
        .catch(() => console.log("mark as read api failed"));
  };

  const setRead = () => {
    setUnRead(false);
  };

  useEffect(() => {
    markAsRead();

    socket.emit("createChatRoom", id);
    socket.on("setRead", setRead);

    return () => {
      socket.off("setRead", setRead);
    };
  }, []);

  return (
    <div className={`flex items-start mb-2 ${messageClass}`}>
      {!isSent && (
        <Avatar
          alt={from.firstname}
          src={
            from.image ??
            `https://api.dicebear.com/5.x/avataaars/svg?seed=${from.firstname}`
          }
        />
      )}
      <div className={`p-2 rounded-2xl ml-2 ${messageContainerClass}`}>
        <div className="p-2 rounded-lg">
          <strong className="text-gray-600">Bid Confirmation</strong>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <img
                src={message.bid.product.images[0]}
                alt={message.bid.product.name}
                className="object-cover w-20 h-20 rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {message.bid.product.name}
              </h3>
              <p className="text-gray-500">
                Bid Price {`₹${message.bid.price}`}
              </p>
            </div>
          </div>
          {/* <p>{message.bid.product.description}</p> */}
        </div>

        <small className="mr-2">{convertDateFormat(createdAt)}</small>
        {isSent &&
          (!unread ? (
            <DoneAllIcon className="!text-[18px]" />
          ) : (
            <DoneIcon className="!text-[18px]" />
          ))}
      </div>
      {isSent && (
        <Avatar
          alt={from.firstname}
          src={
            from.image ??
            `https://api.dicebear.com/5.x/avataaars/svg?seed=${from.firstname}`
          }
        />
      )}
    </div>
  );
};

const convertDateFormat = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "pm" : "am";

  return `${day}/${month} ${hours}:${minutes} ${ampm}`;
};

export {
  TextMessage,
  ProductRequestMessage,
  BroadcastMessage,
  BidConfirmationMessage,
};
