import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

export interface Post {
  _id: string;
  user: { _id: string; name: string; avatarUrl?: string };
  content: string;
  imageUrl?: string;
  likes: string[];
  comments: { _id: string; user: string; text: string; createdAt: string }[];
  createdAt: string;
}

interface PostsState {
  feed: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  feed: [],
  loading: false,
  error: null,
};

export const createPost = createAsyncThunk(
  'posts/create',
  async (payload: { content: string; image?: File | null }, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append('content', payload.content);
      if (payload.image) form.append('image', payload.image);
      const { data } = await api.post('/posts', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      return data as Post;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to create post');
    }
  }
);

export const fetchFeed = createAsyncThunk('posts/fetchFeed', async (_, { getState, rejectWithValue }) => {
  try {
    const state: any = getState();
    const token = state.auth.token as string | null;
    const { data } = await api.get('/posts/feed', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data as Post[];
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message ?? 'Failed to load feed');
  }
});

const slice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load feed';
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.feed = [action.payload, ...state.feed];
      });
  },
});

export default slice.reducer;

