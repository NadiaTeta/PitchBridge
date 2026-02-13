import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { OnboardingScreen } from '@/app/components/OnboardingScreen';
import { RegisterLogin } from '@/app/components/RegisterLogin';
import { EmailVerification } from '@/app/components/EmailVerification';
import { DocumentUpload } from '@/app/components/DocumentUpload';
import { WaitingApproval } from '@/app/components/WaitingApproval';
import { Dashboard } from '@/app/components/Dashboard';
import { PitchCardCreator } from '@/app/components/PitchCardCreator';
import { InvestorDiscoveryFeed } from '@/app/components/InvestorDiscoveryFeed';
import { ProjectDetails } from '@/app/components/ProjectDetails';
import { ChatInterface } from '@/app/components/ChatInterface';
import { AdminDashboard } from '@/app/components/AdminDashboard';
import { UserProfile } from '@/app/components/UserProfile';
import { Navbar } from './components/Navbar';
import { Messages } from './components/Messages';
import { WatchlistPage } from './components/Watchlist';
import { PortfolioPage } from './components/Portofolio';
import { EntrepreneurProjectDetails } from './components/EntrepreneurProjectDetails';

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
      <Route path="/register" element={<RegisterLogin />} />
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