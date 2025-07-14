import React from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useRole } from '../contexts/AuthContext';
import { 
  Calendar, 
  BarChart3, 
  LogOut, 
  Sun, 
  Moon, 
  Home,
  CalendarDays
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  name: string;
  icon: React.ComponentType<any>;
  href: string;
  roles: string[];
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', icon: Home, href: '/', roles: ['IR_ADMIN', 'ANALYST_MANAGER', 'INVESTMENT_ANALYST'] },
  { name: 'Calendar', icon: Calendar, href: '/calendar', roles: ['ANALYST_MANAGER', 'INVESTMENT_ANALYST'] },
  { name: 'Events', icon: CalendarDays, href: '/events', roles: ['IR_ADMIN', 'ANALYST_MANAGER', 'INVESTMENT_ANALYST'] },
  { name: 'Analytics', icon: BarChart3, href: '/analytics', roles: ['IR_ADMIN', 'ANALYST_MANAGER', 'INVESTMENT_ANALYST'] },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isIRAdmin, isAnalystManager, isInvestmentAnalyst } = useRole();

  const getFilteredNavigation = () => {
    return navigation.filter(item => {
      if (isIRAdmin) return item.roles.includes('IR_ADMIN');
      if (isAnalystManager) return item.roles.includes('ANALYST_MANAGER');
      if (isInvestmentAnalyst) return item.roles.includes('INVESTMENT_ANALYST');
      return false;
    });
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'IR_ADMIN':
        return 'IR Admin';
      case 'ANALYST_MANAGER':
        return 'Analyst Manager';
      case 'INVESTMENT_ANALYST':
        return 'Investment Analyst';
      default:
        return role;
    }
  };

  const getCurrentPageName = () => {
    const path = window.location.pathname;
    const item = navigation.find(n => n.href === path);
    return item?.name || 'Dashboard';
  };

  const handleNavigation = (href: string) => {
    // For now, we'll use a simple hash-based routing
    // In a real app, you'd use React Router
    window.location.hash = href;
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            Agora
          </h1>
          <p className="text-sm text-muted-foreground">IR Event Coordination</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {getFilteredNavigation().map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavigation(item.href)}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors group"
                >
                  <item.icon className="h-5 w-5 mr-3 text-muted-foreground group-hover:text-foreground" />
                  <span className="text-foreground">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile & Settings */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {getRoleDisplayName(user?.role || '')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{getCurrentPageName()}</h2>
              <p className="text-sm text-muted-foreground">
                {user?.company?.name} • {getRoleDisplayName(user?.role || '')}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;