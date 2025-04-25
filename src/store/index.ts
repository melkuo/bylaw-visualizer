import { configureStore } from '@reduxjs/toolkit';
import bylawsReducer from './bylawsSlice';

export const store = configureStore({
  reducer: {
    bylaws: bylawsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 