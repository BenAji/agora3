import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import './index.css';

// Simple hash-based routing for demo purposes
const useHashRouter = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return currentPath;
};

// Loading spinner component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
  </div>
);

// Placeholder components for different pages
const Calendar: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Calendar</h1>
      <p className="text-muted-foreground">View and manage your events calendar</p>
    </div>
    <div className="card p-8 text-center">
      <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
      <p className="text-muted-foreground">
        Interactive calendar with event filtering and RSVP management coming soon...
      </p>
    </div>
  </div>
);

const Events: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Events</h1>
      <p className="text-muted-foreground">Manage your events and RSVPs</p>
    </div>
    <div className="card p-8 text-center">
      <h3 className="text-lg font-semibold mb-2">Event Management</h3>
      <p className="text-muted-foreground">
        Create, edit, and manage events with CSV import/export coming soon...
      </p>
    </div>
  </div>
);

const Analytics: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="text-muted-foreground">View detailed analytics and insights</p>
    </div>
    <div className="card p-8 text-center">
      <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
      <p className="text-muted-foreground">
        Comprehensive analytics with charts and export functionality coming soon...
      </p>
    </div>
  </div>
);

// Main router component
const Router: React.FC = () => {
  const currentPath = useHashRouter();

  switch (currentPath) {
    case '/':
      return <Dashboard />;
    case '/calendar':
      return <Calendar />;
    case '/events':
      return <Events />;
    case '/analytics':
      return <Analytics />;
    default:
      return <Dashboard />;
  }
};

// Main app content with authentication check
const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Router />
    </Layout>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
