import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Sidebar from './components/Layout/Sidebar';
import ToastContainer from './components/UI/ToastContainer';

// Lazy-loaded pages for performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Badges = lazy(() => import('./pages/Badges'));
const Stats = lazy(() => import('./pages/Stats'));

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-xs text-white/30 font-mono tracking-widest">LOADING...</p>
      </div>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="flex min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-64 w-96 h-96 bg-violet-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-900/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <Sidebar />

      <main className="flex-1 relative z-10 min-h-screen overflow-y-auto">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/badges" element={<Badges />} />
            <Route path="/stats" element={<Stats />} />
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center min-h-screen flex-col gap-4">
                  <p className="text-6xl">404</p>
                  <p className="font-display text-2xl font-bold text-white/60">Quest Not Found</p>
                  <a href="/" className="btn-primary mt-2">Return to Base</a>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <AppLayout />
      </GameProvider>
    </BrowserRouter>
  );
}
