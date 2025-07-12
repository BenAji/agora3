import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { authService } from '../services/auth';
import { Moon, Sun, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSampleCredentials, setShowSampleCredentials] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (email: string, password: string) => {
    setCredentials({ email, password });
    setError('');
  };

  const sampleCredentials = authService.getSampleCredentials();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Theme Toggle */}
        <div className="flex justify-end">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        {/* Logo and Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            Agora
          </h1>
          <p className="mt-2 text-muted-foreground">
            Investor Relations Event Coordination
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="input w-full"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input w-full pr-10"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3 text-base font-medium"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sample Credentials */}
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={() => setShowSampleCredentials(!showSampleCredentials)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showSampleCredentials ? 'Hide' : 'Show'} Sample Credentials
            </button>

            {showSampleCredentials && (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">IR Admins (Password: admin)</h3>
                  <div className="space-y-1">
                    {sampleCredentials.irAdmins.map((cred, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickLogin(cred.email, cred.password)}
                        className="block w-full text-left text-xs text-muted-foreground hover:text-foreground p-1 hover:bg-secondary/50 rounded"
                      >
                        {cred.email}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Analysts (Password: user)</h3>
                  <div className="space-y-1">
                    {sampleCredentials.analysts.map((cred, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickLogin(cred.email, cred.password)}
                        className="block w-full text-left text-xs text-muted-foreground hover:text-foreground p-1 hover:bg-secondary/50 rounded"
                      >
                        {cred.email}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;