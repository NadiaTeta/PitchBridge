import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Plus, MessageSquare, Briefcase, Heart, Search, User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user || !user.id) {
    return null;
  }

  const isEntrepreneur = user.role === 'entrepreneur';
  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive(to) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="font-bold text-sm">{label}</span>
    </Link>
  );

  const sidebarContent = (
    <>
      {/* Brand */}
      <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-4 py-5 group">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shrink-0">
          P
        </div>
        <span className="text-lg font-black tracking-tighter text-white">PitchBridge</span>
      </Link>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
        <div className="my-2 h-px bg-white/10" />
        <NavItem to="/messages" icon={MessageSquare} label="Messages" />
        <NavItem to="/profile" icon={User} label="Profile" />
      </nav>

      {/* Logout at bottom */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => {
            setMobileOpen(false);
            logout();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: fixed left sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:z-40 bg-slate-900 text-white border-r border-white/10">
        {sidebarContent}
      </aside>

      {/* Mobile: top bar with menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-slate-900 border-b border-white/10 flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white">P</div>
          <span className="text-base font-black tracking-tighter text-white">PitchBridge</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-slate-300 hover:text-white rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile: overlay sidebar */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="md:hidden fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 flex flex-col bg-slate-900 text-white border-r border-white/10 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="font-bold text-white">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-300 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col pt-2">
              {sidebarContent}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
