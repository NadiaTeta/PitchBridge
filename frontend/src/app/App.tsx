import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OnboardingScreen } from './components/OnboardingScreen';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { EmailVerification } from './components/EmailVerification';
import { DocumentUpload } from './components/DocumentUpload';
import { WaitingApproval } from './components/WaitingApproval';
import { Dashboard } from './components/Dashboard';
import { PitchCardCreator } from './components/PitchCardCreator';
import { InvestorDiscoveryFeed } from './components/InvestorDiscoveryFeed';
import { ProjectDetails } from './components/ProjectDetails';
import { ChatInterface } from './components/ChatInterface';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfile } from './components/UserProfile';
import { Navbar } from './components/Navbar';
import { Messages } from './components/Messages';
import { WatchlistPage } from './components/Watchlist';
import { PortfolioPage } from './components/Portofolio';
import { EntrepreneurProjectDetails } from './components/EntrepreneurProjectDetails';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { Settings } from './components/Settings';

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> 
      <main className="flex-1">
        <Outlet /> 
      </main>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingScreen />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/upload-documents" element={<DocumentUpload />} />
      <Route path="/waiting-approval" element={<WaitingApproval />} />
      
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/entrepreneur/dashboard" element={<Dashboard />} />
        <Route path="/investor/dashboard" element={<Dashboard />} />
        <Route path="/entrepreneur/project/:id" element={<EntrepreneurProjectDetails />} />
        <Route path="/entrepreneur/pitch-card" element={<PitchCardCreator />} />
        <Route path="/investor/discover" element={<InvestorDiscoveryFeed />} />
        <Route path="/watchlist" element={<WatchlistPage />} /> 
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/chat/:id" element={<ChatInterface />} />
        <Route path="/chat" element={<ChatInterface />} /> 
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:id" element={<Messages />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/:id/:viewType" element={<UserProfile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      {/* Admin */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
            <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}