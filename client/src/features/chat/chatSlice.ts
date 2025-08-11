import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../lib/api';
import { getSocket } from '../../lib/socket';

export interface Conversation {
  _id: string;
  participants: { _id: string; name: string; avatarUrl?: string }[];
  lastMessageAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  from: string;
  to: string;
  text: string;
  createdAt: string;
}

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // key by other userId
  activeUserId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  activeUserId: null,
  loading: false,
  error: null,
};

export const fetchConversations = createAsyncThunk('chat/conversations', async () => {
  const { data } = await api.get('/chat/conversations');
  return data as Conversation[];
});

export const fetchMessages = createAsyncThunk('chat/messages', async (otherUserId: string) => {
  const { data } = await api.get(`/chat/messages/${otherUserId}`);
  return { otherUserId, messages: data as Message[] };
});

export const sendMessage = createAsyncThunk('chat/send', async (
  payload: { to: string; text: string },
) => {
  const socket = getSocket();
  socket.emit('chat:send', payload);
  // Optimistic UI handled in reducer via local append when we receive echo
  return payload;
});

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveUser(state, { payload }: { payload: string | null }) {
      state.activeUserId = payload;
    },
    receiveMessage(state, { payload }: { payload: Message }) {
      const other = payload.from;
      if (!state.messages[other]) state.messages[other] = [];
      state.messages[other].push(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.conversations = payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any) ?? 'Failed to load conversations';
      })
      .addCase(fetchMessages.fulfilled, (state, { payload }) => {
        state.messages[payload.otherUserId] = payload.messages;
      });
  },
});

export const { setActiveUser, receiveMessage } = slice.actions;
export default slice.reducer;

