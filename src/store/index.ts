import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from '../features/projects/projectsSlice';
import chatsReducer from '../features/chats/chatsSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    chats: chatsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
