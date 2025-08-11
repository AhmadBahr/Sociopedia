import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/users/me');
    return data as User;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch me');
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async (
    payload: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      return data as { token: string; user: User };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    payload: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post('/auth/login', payload);
      return data as { token: string; user: User };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Login failed');
    }
  }
);

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    restoreToken(state) {
      const token = localStorage.getItem('token');
      if (token) state.token = token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Registration failed';
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Login failed';
      })
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout, restoreToken } = slice.actions;
export default slice.reducer;

