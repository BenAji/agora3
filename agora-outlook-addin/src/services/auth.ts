import type { UserWithCompany, LoginCredentials } from '../types';
import { database } from './database';

// Simple authentication service for demo purposes
class AuthService {
  private readonly STORAGE_KEY = 'agora_auth_user';

  // Get current user from localStorage
  getCurrentUser(): UserWithCompany | null {
    try {
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      if (!storedUser) return null;
      
      const userData = JSON.parse(storedUser);
      // Re-fetch user data to ensure it's up to date
      return database.getUserWithCompany(userData.id) || null;
    } catch {
      return null;
    }
  }

  // Login with email and password
  async login(credentials: LoginCredentials): Promise<UserWithCompany | null> {
    const { email, password } = credentials;
    
    // Find user by email
    const user = database.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Simple password validation for demo
    // IR Admins use "admin", Analysts use "user"
    const expectedPassword = user.role === 'IR_ADMIN' ? 'admin' : 'user';
    if (password !== expectedPassword) {
      throw new Error('Invalid email or password');
    }

    // Get user with company info
    const userWithCompany = database.getUserWithCompany(user.id);
    if (!userWithCompany) {
      throw new Error('User company not found');
    }

    // Store in localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ id: user.id }));

    return userWithCompany;
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Get sample credentials for demo
  getSampleCredentials() {
    return {
      irAdmins: [
        { email: 'ir.admin@apple.com', password: 'admin' },
        { email: 'ir.admin@microsoft.com', password: 'admin' },
        { email: 'ir.admin@tesla.com', password: 'admin' }
      ],
      analysts: [
        { email: 'spencer.beasley@bloomberg.com', password: 'user' },
        { email: 'deborah.drake@bloomberg.com', password: 'user' },
        { email: 'ewan.martinez@bloomberg.com', password: 'user' },
        { email: 'clyde.nelson@bloomberg.com', password: 'user' }
      ]
    };
  }
}

// Export singleton instance
export const authService = new AuthService();