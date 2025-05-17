import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Loading } from './components/common/Loading';
import { ErrorBoundary } from './ErrorBoundary';
import { Component as App } from './App';
import { Component as HomePage } from './pages/HomePage';
import { Component as AchievementPage } from './pages/AchievementPage';
import { Component as CategoryPage } from './pages/CategoryPage';
import { Component as SettingsPage } from './pages/SettingsPage';
import * as github from './utils/github';

const container = document.getElementById('root');
const root = createRoot(container!);

// Not using lazy loading here as it breaks constantly when using the GitHub Pages SPA workaround.
const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        Component: HomePage,
        hydrateFallbackElement: <Loading loading={true} />,
      },
      {
        path: '/achievements/:id',
        Component: AchievementPage,
        hydrateFallbackElement: <Loading loading={true} />,
      },
      {
        path: '/categories/:id',
        Component: CategoryPage,
        hydrateFallbackElement: <Loading loading={true} />,
      },
      {
        path: '/settings',
        Component: SettingsPage,
        hydrateFallbackElement: <Loading loading={true} />,
      },
    ],
  },
]);

const version = import.meta.env.APP_VERSION!;

console.log(`%cApp Version:%c${version} (${github.commit(version)})`, 'font-weight: bold;');

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
