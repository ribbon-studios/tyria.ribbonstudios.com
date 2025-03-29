import { api } from '@/service/api';
import { type AppState } from '.';
import { createAppSlice } from './utils';
import { delay } from '@ribbon-studios/js-utils';

export type ApiSlice = {
  key?: string;
  valid: boolean;
  loading: boolean;
  error?: Error;
};

const cachedKey = localStorage.getItem('api-key') ?? undefined;

api.config.access_token = cachedKey;

export const apiSlice = createAppSlice({
  name: 'api',
  initialState: {
    key: cachedKey,
    valid: !!cachedKey,
    loading: false,
  } satisfies ApiSlice as ApiSlice,
  reducers: (create) => ({
    setApiKey: create.asyncThunk(
      async (token: string | undefined) => {
        if (token) {
          const { permissions } = await delay(
            api.v2.tokeninfo({
              access_token: token,
            }),
            1000
          );

          if (!permissions.includes('account')) {
            throw new Error('Missing required permission!');
          }
        }

        return token;
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        rejected: (state) => {
          localStorage.removeItem('api-key');

          state = {
            ...state,
            loading: false,
            key: undefined,
            valid: false,
          };
        },
        fulfilled: (state, action) => {
          if (action.payload) {
            localStorage.setItem('api-key', action.payload);

            return {
              ...state,
              loading: false,
              key: action.payload,
              valid: true,
            };
          }

          localStorage.removeItem('api-key');

          return {
            ...state,
            loading: false,
            key: undefined,
            valid: false,
          };
        },
      }
    ),
  }),
});

// Action creators are generated for each case reducer function
export const { setApiKey } = apiSlice.actions;

export const selectApi = (state: AppState) => state.api;
export const selectApiKey = (state: AppState) => selectApi(state).key;
export const isApiKeyValidating = (state: AppState) => selectApi(state).loading;

export default apiSlice.reducer;
