import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store';
import { Loading } from './components/common/Loading';
import { ErrorBoundary } from './ErrorBoundary';

const container = document.getElementById('root');
const root = createRoot(container!);

const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('./App'),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        lazy: () => import('./pages/HomePage'),
        hydrateFallbackElement: <Loading loading={true} />,
      },
      {
        path: '/achievements/:id',
        lazy: () => import('./pages/AchievementPage'),
        hydrateFallbackElement: <Loading loading={true} />,
      },
      {
        path: '/categories/:id',
        lazy: () => import('./pages/CategoryPage'),
        hydrateFallbackElement: <Loading loading={true} />,
      },
      {
        path: '/settings',
        lazy: () => import('./pages/SettingsPage'),
        hydrateFallbackElement: <Loading loading={true} />,
      },
    ],
  },
]);

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      // TODO: This breaks the refetch interval for some reason
      // refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
