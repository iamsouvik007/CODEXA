import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RootLayout from './components/layout/RootLayout';

// Eager load landing page (it's the entry point)
import LandingPage from './App';

// Lazy load learning routes for code splitting
const LearningHub = lazy(() => import('./pages/LearningHub'));
const WebDevTrack = lazy(() => import('./pages/WebDevTrack'));

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        <span className="text-sm text-text-muted">Loading...</span>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'learn',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LearningHub />
          </Suspense>
        ),
      },
      {
        path: 'learn/web-development',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <WebDevTrack />
          </Suspense>
        ),
      },
      {
        path: 'learn/web-development/:lessonId',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <WebDevTrack />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
