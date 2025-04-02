import { type AppState } from '.';
import { createAppSlice } from './utils';
import { parseSafe } from '@/utils/json';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TrueMasterySlice = {
  categories: number[];
};

const cachedState = parseSafe<TrueMasterySlice>(localStorage.getItem('true-mastery'));

const initialState: TrueMasterySlice = {
  categories: [],
  ...cachedState,
};

export const TrueMasterySlice = createAppSlice({
  name: 'api',
  initialState,
  reducers: () => ({
    setTrueMastery: (state, action: PayloadAction<number | number[]>) => {
      const new_categories = Array.isArray(action.payload) ? action.payload : [action.payload];

      const updatedState: TrueMasterySlice = {
        ...state,
        categories: [...state.categories, ...new_categories],
      };

      localStorage.setItem('true-mastery', JSON.stringify(updatedState));

      return updatedState;
    },
    resetTrueMastery: () => {
      const updatedState: TrueMasterySlice = {
        categories: [],
      };

      localStorage.setItem('true-mastery', JSON.stringify(updatedState));

      return updatedState;
    },
  }),
});

// Action creators are generated for each case reducer function
export const { setTrueMastery, resetTrueMastery } = TrueMasterySlice.actions;

export const selectTrueMastery = (state: AppState) => state.true_mastery;
export const selectTrueMasteries = (state: AppState) => selectTrueMastery(state).categories;

export default TrueMasterySlice.reducer;
