import { createSlice } from '@reduxjs/toolkit';

export interface ThemeState {
  theme: 'dark' | 'light';
}

const initialState: ThemeState = {
  theme: 'light'
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      console.log('state.theme: ' + state.theme);
    }
  },
  selectors: {
    getTheme: (state) => state.theme
  },
  }
);

export const { getTheme } = themeSlice.selectors;
export const { toggleTheme } = themeSlice.actions;

