import { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/app/data/userData';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  documentsUploaded: boolean;
  accountApproved: boolean;
  watchlist: string[]; // Changed to array to store multiple IDs
  portfolio: string[]; // Changed to array to store multiple IDs
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  verifyEmail: (code: string) => Promise<void>;
  uploadDocuments: () => void;
  updateUser: (newData: Partial<User>) => void; // New function to handle watchlist/portfolio updates
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    // In real app, call backend API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      emailVerified: false,
      documentsUploaded: false,
      accountApproved: true,
      watchlist: [], // Initialize empty
      portfolio: []  // Initialize empty
    };
    
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    // In real app, call backend API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock login - simulate approved user
    const mockUser: User = {
      id: 'user123',
      name: 'Jean-Claude Mugabo',
      email,
      role: 'investor', // Set to investor for testing discovery features
      emailVerified: true,
      documentsUploaded: true,
      accountApproved: true,
      watchlist: [],
      portfolio: []
    };
    
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const verifyEmail = async (code: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (user) {
      setUser({ ...user, emailVerified: true });
    }
  };

  const uploadDocuments = () => {
    if (user) {
      setUser({ ...user, documentsUploaded: true });
    }
  };

  // Helper to update user state from any component
  const updateUser = (newData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...newData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        verifyEmail,
        uploadDocuments,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}