import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Plus, MessageSquare, Briefcase, Heart, Search, User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user || !user.id) {
    return null;
  }

  const isEntrepreneur = user.role === 'entrepreneur';
  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Helper for Nav Links
  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link 
      to={to} 
      onClick={() => setIsMenuOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive(to) 
          ? 'bg-blue-600 text-white' 
          : 'text-slate-300 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-bold text-sm">{label}</span>
    </Link>
  );

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* 1. Brand */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black">
              P
            </div>
            <span className="text-lg font-black tracking-tighter">PitchBridge</span>
          </Link>

          {/* 2. Desktop Menu (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-2">
            {isEntrepreneur ? (
              <>
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/entrepreneur/pitch-card" icon={Plus} label="Add Project" />
              </>
            ) : (
              <>
                <NavItem to="/investor/discover" icon={Search} label="Discover" />
                <NavItem to="/watchlist" icon={Heart} label="Watchlist" />
                <NavItem to="/portfolio" icon={Briefcase} label="Portfolio" />
              </>
            )}
            <div className="h-6 w-px bg-white/10 mx-2" />
            <NavItem to="/chat" icon={MessageSquare} label="Messages" />
            <NavItem to="/profile" icon={User} label="Profile" />
            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors ml-2"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* 3. Mobile Hamburger Toggle (Hidden on Desktop) */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* 4. Mobile Dropdown Menu (Animated) */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 space-y-2 animate-in slide-in-from-top duration-300">
            <div className="h-px bg-white/5 mb-4" />
            
            {isEntrepreneur ? (
              <>
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/entrepreneur/pitch-card" icon={Plus} label="New Pitch" />
              </>
            ) : (
              <>
                <NavItem to="/investor/discover" icon={Search} label="Discover Feeds" />
                <NavItem to="/watchlist" icon={Heart} label="My Watchlist" />
                <NavItem to="/portfolio" icon={Briefcase} label="My Portfolio" />
              </>
            )}
            
            <NavItem to="/chat" icon={MessageSquare} label="Messages (2)" />
            <NavItem to="/profile" icon={User} label="My Profile" />
            
            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}