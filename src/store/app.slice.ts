import { type AppState } from '.';
import { createAppSlice } from './utils';
import type { PayloadAction } from '@reduxjs/toolkit';

export type AppSlice = {
  header: {
    breadcrumbs: AppSlice.Breadcrumb[];
    image?: string;
  };
};

export namespace AppSlice {
  export type Breadcrumb = {
    label: string;
    link?: string;
  };
}

export const appSlice = createAppSlice({
  name: 'app',
  initialState: {
    header: {
      breadcrumbs: [],
      image: undefined,
    },
  } satisfies AppSlice as AppSlice,
  reducers: () => ({
    setHeader: (state, action: PayloadAction<AppSlice['header']>) => {
      state.header = action.payload;
    },
  }),
});

// Action creators are generated for each case reducer function
export const { setHeader } = appSlice.actions;

export const selectAppState = (state: AppState) => state.app;
export const selectHeader = (state: AppState) => selectAppState(state).header;

export default appSlice.reducer;
