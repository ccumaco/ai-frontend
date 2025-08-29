import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../store';
import { Chat } from '../../types';
import { apiService } from '../../services/apiService';

interface ChatsState {
  data: Chat[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatsState = {
  data: [],
  loading: false,
  error: null,
};

// ✅ Thunk que recibe un projectId
export const fetchChatsByProject = createAsyncThunk<
  Chat[], // tipo de retorno
  string, // argumento (projectId)
  { rejectValue: string } // en caso de error
>('chats/fetchByProject', async (projectId, { rejectWithValue }) => {
  try {
    const response = await apiService.listChatsByProject(projectId);
    if (response.success) {
      return response.data as Chat[];
    }
    return rejectWithValue('Failed to fetch chats');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Unexpected error');
  }
});

// ✅ Thunk para crear chat
export const createChat = createAsyncThunk<
  Chat, // tipo de retorno
  { projectId: string; name: string }, // argumento
  { rejectValue: string } // en caso de error
>('chats/createChat', async ({ projectId, name }, { rejectWithValue }) => {
  try {
    const response = await apiService.createChat({ projectId, name });
    if (response.success) {
      return response.data as Chat;
    }
    return rejectWithValue('Failed to create chat');
  } catch (error: any) {
    // Manejo de error detallado
    if (error?.response?.data?.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue(error.message || 'Unexpected error');
  }
});

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    clearChats: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
    },
    // Added reducer to set chats globally
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.data = action.payload;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetchChats ---
      .addCase(fetchChatsByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChatsByProject.fulfilled,
        (state, action: PayloadAction<Chat[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchChatsByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      })
      // --- createChat ---
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action: PayloadAction<Chat>) => {
        state.loading = false;
        state.data.push(action.payload); // ✅ agrega el nuevo chat al array
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

export const { clearChats, setChats } = chatsSlice.actions;

// ✅ Selectores
export const selectChats = (state: RootState) => state.chats.data;
export const selectChatsLoading = (state: RootState) => state.chats.loading;
export const selectChatsError = (state: RootState) => state.chats.error;

export default chatsSlice.reducer;
