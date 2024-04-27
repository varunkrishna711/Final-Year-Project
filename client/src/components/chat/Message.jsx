import React, { useEffect } from "react";
import axios from "axios";
import { Avatar } from "@mui/material";
import { CheckCircle, CheckCircleOutline } from "@mui/icons-material";

const TextMessage = ({ id, message, from, to, time, read, isSent }) => {
  console.log({ message, from, to, time, read, isSent });

  const messageClass = isSent ? "flex justify-end" : "flex justify-start";
  const messageContainerClass = isSent ? "bg-green-200" : "bg-gray-200";

  const markAsRead = async () => {
    if (!isSent)
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/chat/mark-as-read/${id}`
      );
  };

  useEffect(() => {
    markAsRead();
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
      {console.log(from.firstname)}
      <div className={`p-2 rounded-lg ml-2 ${messageContainerClass}`}>
        <p>{message}</p>
        <small className="mr-2">{convertDateFormat(time)}</small>
        {isSent && (read ? <CheckCircle /> : <CheckCircleOutline />)}
      </div>
      {isSent && (
        <Avatar
          alt={to.firstname}
          src={
            to.image ??
            `https://api.dicebear.com/5.x/avataaars/svg?seed=${to.firstname}`
          }
        />
      )}
      {console.log(to.firstname)}
    </div>
  );
};

const ProductRequestMessage = ({
  productRequest,
  from,
  to,
  time,
  read,
  isSent,
}) => {
  const messageClass = isSent ? "flex justify-end" : "flex justify-start";
  const messageContainerClass = isSent ? "bg-green-200" : "bg-gray-200";
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
      <div className={`p-2 rounded-lg ml-2 ${messageContainerClass}`}>
        <p>{`${from.firstname} requested: ${productRequest}`}</p>
        <small>{time}</small>
        {read ? <CheckCircle /> : <CheckCircleOutline />}
      </div>
      {isSent && (
        <Avatar
          alt={to.firstname}
          src={
            to.image ??
            `https://api.dicebear.com/5.x/avataaars/svg?seed=${to.firstname}`
          }
        />
      )}{" "}
    </div>
  );
};

const BroadcastMessage = ({ message, time }) => {
  return (
    <div className="flex justify-end mb-2">
      <div className="p-2 text-black bg-green-300 rounded-lg">
        <p>{message}</p>
        <small>{time}</small>
      </div>
    </div>
  );
};

const BidConfirmationMessage = ({ message, time }) => {
  return (
    <div className="flex justify-end mb-2">
      <div className="p-2 text-black bg-green-300 rounded-lg">
        <p>{message}</p>
        <small>{time}</small>
      </div>
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
