import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMessages,
  fetchChatList,
  fetchChatListFromLocation,
  postTextMessage,
} from "../api/chatsApi";

const initialState = {
  isLoading: false,
  chatList: [],
  totalCount: 0,
  selectedChat: null,
  chats: [],
};

export const loadChatList = createAsyncThunk(
  "chat/loadChatList",
  async (arg) => {
    try {
      let response = await fetchChatList(arg.userId);
      if (response.length === 0)
        response = await fetchChatListFromLocation(arg.latitude, arg.longitude);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const sendTextMessage = createAsyncThunk(
  "chat/sendTextMessage",
  async (arg) => {
    try {
      const { userId: from, id: to, message } = arg;
      let data = await postTextMessage(from, to, message);
      console.log(data);
      return data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const loadMessages = createAsyncThunk(
  "chat/loadMessages",
  async (arg) => {
    try {
      const response = await fetchMessages(arg.from, arg.to);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setChatList: (state, action) => {
      state.chatList = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChatList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadChatList.fulfilled, (state, action) => {
        state.chatList = action.payload;
        state.totalCount = action.payload.count;
        state.isLoading = false;
      })
      .addCase(loadChatList.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(loadMessages.pending, (state, action) => {
        state.isLoading = true;
        state.selectedChat = action.payload.to;
        state.chats = [];
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.isLoading = false;
      })
      .addCase(loadMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.selectedChat = null;
        state.chats = [];
      });
  },
});

export const { setLoading, setSelectedChat, setChats } = chatSlice.actions;

export default chatSlice.reducer;
