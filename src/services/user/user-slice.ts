// src\services\user\user-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TNotificationEvent, TUser } from '../../api/types';
import { getUserLikesThunk, getUserThunk, logoutThunk } from './actions';

export interface UserState {
  сurrentUser: TUser | null;
  likes: number[]; // id пользователей, которых лайкнул авторизованный юзер
  currentOffers: TNotificationEvent[];
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  сurrentUser: null,
  likes: [],
  currentOffers: [],
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<TUser>) => {
      state.сurrentUser = action.payload;
    },
    setCurrentOffers: (state, action: PayloadAction<TNotificationEvent[]>) => {
      state.currentOffers = action.payload;
    },
    addCurrentOffers: (state, action: PayloadAction<TNotificationEvent>) => {
      state.currentOffers.push(action.payload);
    }
  },
  selectors: {
    getCurrentUser: (state) => state.сurrentUser,
    getOffers: (state) => state.currentOffers
  },
  extraReducers: builder => {
    builder
    .addCase(getUserThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
    })

    .addCase(getUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.сurrentUser = action.payload;
    })
    .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки пользователя';
    })
    .addCase(getUserLikesThunk.pending, state => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getUserLikesThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.likes = action.payload; 
    })
    .addCase(getUserLikesThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка загрузки лайков';
    })

    .addCase(logoutThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(logoutThunk.fulfilled, (state) => {
      state.сurrentUser = null;
      state.isAuthChecked = false;
      state.isLoading = false;
    })
    .addCase(logoutThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка при выходе';
    });
  }
});
 
export const {
  getCurrentUser,
  getOffers
} = userSlice.selectors;
 
export const {
  setCurrentUser,
  setCurrentOffers,
  addCurrentOffers
} = userSlice.actions;

export const userReducer = userSlice.reducer;

