import { type AppState } from '.';
import { createAppSlice } from './utils';
import { parseSafe } from '@/utils/json';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TrueMasterySlice = {
  version: number;
  categories: Record<number, MasteryTier>;
};

export enum MasteryTier {
  /**
   * The meta achievement of the category has been finished.
   */
  META = 0,

  /**
   * The entire category has been finished.
   */
  TRUE = 1,
}

if (localStorage.getItem('true-mastery')) {
  localStorage.setItem('mastery', localStorage.getItem('true-mastery')!);
  localStorage.removeItem('true-mastery');
}

const cachedState = parseSafe<TrueMasterySlice>(localStorage.getItem('mastery'));

const CURRENT_VERSION = 1;

const initialState: TrueMasterySlice = {
  version: 0,
  categories: [],
  ...cachedState,
};

// Upgrade older state
if (
  initialState.version === 0 &&
  Array.isArray(initialState.categories) &&
  initialState.categories.length > 0 &&
  typeof initialState.categories[0] === 'number'
) {
  initialState.version = 1;
  initialState.categories = initialState.categories.reduce<Record<number, MasteryTier>>((output, category) => {
    output[category] = MasteryTier.TRUE;
    return output;
  }, {});

  localStorage.setItem('mastery', JSON.stringify(initialState));
}

export const TrueMasterySlice = createAppSlice({
  name: 'api',
  initialState,
  reducers: () => ({
    setMasteryTier: (state, action: PayloadAction<[number | number[], MasteryTier]>) => {
      const [category, tier] = action.payload;
      const new_categories = Array.isArray(category) ? category : [category];

      const updatedState: TrueMasterySlice = {
        ...state,
        categories: {
          ...state.categories,
          ...new_categories.reduce<TrueMasterySlice['categories']>((output, id) => {
            output[id] = tier;
            return output;
          }, {}),
        },
      };

      localStorage.setItem('mastery', JSON.stringify(updatedState));

      return updatedState;
    },
    resetTrueMastery: () => {
      const updatedState: TrueMasterySlice = {
        version: CURRENT_VERSION,
        categories: {},
      };

      localStorage.setItem('mastery', JSON.stringify(updatedState));

      return updatedState;
    },
  }),
});

// Action creators are generated for each case reducer function
export const { setMasteryTier, resetTrueMastery } = TrueMasterySlice.actions;

export const selectMasteryState = (state: AppState) => state.mastery;
export const selectMasteryCategories = (state: AppState) => selectMasteryState(state).categories;

export default TrueMasterySlice.reducer;
