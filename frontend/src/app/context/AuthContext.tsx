import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { UserRole } from '../data/userData';
import { handleApiError } from '../utils/errorHandler';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  documentsUploaded: boolean;
  accountApproved: boolean;
  watchlist: string[];
  portfolio: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  verifyEmail: (code: string) => Promise<void>;
  uploadDocuments: (formData: FormData) => Promise<void>;
  updateUser: (newData: Partial<User>) => void;
  isAuthenticated: boolean;
  loading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await api.get('/auth/me');
        setUser({
          ...data.user,
          id: data.user._id || data.user.id
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const register = async (userData: { name: string; email: string; password: string; role: string }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    
    // DEBUG: Copy the output of this from your console if it still fails
    console.log("RAW BACKEND DATA:", data);

    // 1. Check for token (handle both 'token' or 'accessToken' just in case)
    const token = data.token || data.accessToken;
    
    if (token) {
      localStorage.setItem('token', token);
    } else {
      console.warn("User created (201), but no token was found in the response.");
    }

    // 2. Update the user state
    // If the backend sends { user: {...} }, use data.user. Otherwise use data itself.
    const userPayload = data.user || data;
    
    setUser({
      ...userPayload,
      id: userPayload._id || userPayload.id
    });

    console.log("Registration state updated successfully!");
    return data; // Always return data so the component's 'await' finishes properly

  } catch (error: any) {
    // This logs the actual error message from the backend (like 'Email already exists')
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Registration Error:", errorMessage);
    throw new Error(handleApiError(error));
  }
};
  const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // DEBUG: Look at this in your browser console!
    console.log("Full Response Object:", response);

    // Handle different Axios behaviors (destructured vs non-destructured)
    const data = response.data ? response.data : response;

    if (!data || (!data.token && !data.accessToken)) {
      throw new Error("Server responded successfully but provided no security token.");
    }

    const token = data.token || data.accessToken;
    localStorage.setItem('token', token);

    // Safely handle user data
    const rawUser = data.user || data;
    const userData = {
      ...rawUser,
      id: rawUser._id || rawUser.id
    }
    setUser(userData);

    return userData; // Return the user data for further processing in the component

  } catch (error: any) {
    // This will print the actual server error message if it exists
    console.error("Login Crash Details:", error.response?.data || error.message);
    throw new Error(handleApiError(error));
  }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const verifyEmail = async (code: string) => {
    try {
      await api.post('/auth/verify-email', { 
        email: user?.email, 
        code 
      });
      setUser(prev => prev ? { ...prev, emailVerified: true } : null);
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  };

  const uploadDocuments = async (formData: FormData) => {
    const { data } = await api.post('/auth/upload-docs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (data?.user) {
      setUser({
        ...data.user,
        id: data.user._id || data.user.id
      });
    } else {
      setUser(prev => (prev ? { ...prev, documentsUploaded: true } : prev));
    }

    return data;
  };

  const updateUser = (newData: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...newData } : null));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

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
        loading
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