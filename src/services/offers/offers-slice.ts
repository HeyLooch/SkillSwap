// src\services\user\user-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOffer } from '../../api/types';
import { addOfferThunk, getOffersThunk } from './actions';

export interface OffersState {
  offers: TOffer[];
  offersByMe: number[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OffersState = {
  offers: [],
  offersByMe: [],
  isLoading: false,
  error: null
};

export const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setOfferByMe: (state, action: PayloadAction<number>) => {
      state.offersByMe.push(action.payload);
    },
    clearOffersByMe: (state) => {
      state.offersByMe = [];
    }
  },
  selectors: {
    getOffers: (state) => state.offers,
    getOffersByMe: (state) => state.offersByMe
  },
  extraReducers: builder => {
    builder
    .addCase(getOffersThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
    })

    .addCase(getOffersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.offers = action.payload;
    })
    .addCase(getOffersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки предложений';
    })
    .addCase(addOfferThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
    })

    .addCase(addOfferThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.offers.push(action.payload);
    })
    .addCase(addOfferThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания предложения';
    })
  }
});

export const { getOffers, getOffersByMe } = offersSlice.selectors;
export const { setOfferByMe, clearOffersByMe } = offersSlice.actions;

export const offersReducer = offersSlice.reducer;

