// src\services\filters\filters-slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GENDERS, TGender } from '@api/types';
import { SKILL_TYPES, TSkillType } from '../../shared/types/filters';

interface FiltersState {
  skillType: TSkillType;
  subcategories: number[];
  gender: TGender;
  places: string[];
  text_for_search: string;
}

const getInitialState = (): FiltersState => ({
  skillType: SKILL_TYPES.ALL,
  subcategories: [],
  gender: GENDERS.UNSPECIFIED,
  places: [],
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
    setSubcategories: (state, action: PayloadAction<number[]>) => {
      state.subcategories = action.payload;
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
    resetFilters: () => getInitialState(),
  },
  selectors: {
    getSkillType: (state) => state.skillType,
    getSubcategories: (state) => state.subcategories,
    getGender: (state) => state.gender,
    getPlaces: (state) => state.places
  }
});


export const {
  getSkillType,
  getSubcategories,
  getGender,
  getPlaces
} = filtersSlice.selectors;

export const { 
  setSkillType,
  setSubcategories,
  setGender,
  setPlaces,
  setTextForSearch,
  resetFilters
} = filtersSlice.actions;

export const filtersReducer = filtersSlice.reducer;
