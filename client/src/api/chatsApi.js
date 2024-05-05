import { $host } from "./api";

export const fetchMessages = async (from, to) => {
  const { data } = await $host.get(`api/chat/${from}/${to}`);
  return data;
};

export const fetchChatList = async (id, lat, lgt, isAdmin) => {
  const { data } = await $host.get(`api/chat/chat-list/${id}`, {
    params: { isAdmin, lat, lgt },
  });
  return data;
};

export const postTextMessage = async (from, to, message) => {
  const { data } = await $host.post(`api/chat/message/`, {
    from,
    to,
    message: { message },
    type: "TEXT",
  });
  return data;
};
