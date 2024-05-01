import { $host } from "./api";

export const fetchMessages = async (from, to) => {
  const { data } = await $host.get(`api/chat/${from}/${to}`);
  return data;
};

export const fetchChatList = async (id) => {
  const { data } = await $host.get(`api/chat/chat-list/${id}`);
  return data;
};

export const fetchChatListFromLocation = async (lat, lgt, isAdmin) => {
  let data;
  if (isAdmin)
    ({ data } = await $host.get(`api/chat/chat-list/${lat}/${lgt}`, {
      params: { isAdmin },
    }));
  else ({ data } = await $host.get(`api/chat/chat-list/${lat}/${lgt}`));
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
