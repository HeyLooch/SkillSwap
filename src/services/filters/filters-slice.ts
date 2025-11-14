// src\services\filters\filters-slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GENDERS, TGender } from '@api/types';
import { SKILL_TYPES, TSkillType } from '../../shared/types/filters';

interface FiltersState {
  skillType: TSkillType;
  gender: TGender;
  places: string[];
  subcategories: number[];
  text_for_search: string;
};

const getInitialState = (): FiltersState => ({
  skillType: SKILL_TYPES.ALL,
  gender: GENDERS.UNSPECIFIED,
  places: [],
  subcategories: [],
  text_for_search: ''
});

const initialState = getInitialState();

export const isFiltersEmpty = (state: FiltersState): boolean => {
  return (
    state.gender === GENDERS.UNSPECIFIED &&
    state.places.length === 0 &&
    state.subcategories.length === 0 &&
    state.text_for_search.trim() === ''
  );
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSkillType: (state, action: PayloadAction<TSkillType>) => {
      state.skillType = action.payload;
    },
    setGender: (state, action: PayloadAction<TGender>) => {
      state.gender = action.payload;
    },
    setPlaces: (state, action: PayloadAction<string[]>) => {
      state.places = action.payload;
    },
    setTextForSearch: (state, action: PayloadAction<string>) => {
      state.text_for_search = action.payload;
    },
    setSubcategories: (state, action: PayloadAction<number[]>) => {
      state.subcategories = action.payload;
    },
    resetFilters: () => getInitialState(),
  },
});

export const { 
  setSkillType,
  setGender,
  setPlaces,
  setTextForSearch,
  resetFilters,
  setSubcategories
} = filtersSlice.actions;
export const filtersReducer = filtersSlice.reducer;
