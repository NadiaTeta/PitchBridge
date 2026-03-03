import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Plus, List, TrendingUp, Settings, ChevronRight, LayoutDashboard, Briefcase } from 'lucide-react';
import { mockProjects } from '../data/mockData';
import { useProjects } from '../hooks/useProjects';

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else if (!user.emailVerified) {
      navigate('/verify-email');
    } else if (!user.documentsUploaded) {
      navigate('/upload-documents');
    } //else if (!user.accountApproved) {
     // navigate('/waiting-approval');
    //}
  }, [user, navigate]);

  if (!user) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const { projects: userProjects, loading } = useProjects({}, true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      
      {/* Top Welcome Bar */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6 md:pt-8 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {user.role === 'entrepreneur' ? 'Management Hub' : 'Investment Portfolio'}
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium">Welcome back, {user.name || 'Partner'}</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 max-w-6xl mx-auto">
        {/* Entrepreneur View */}
        {user.role === 'entrepreneur' && (
          <div className="space-y-6 md:space-y-8">
            
            {/* Action Cards - Stack on mobile, Grid on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <button
                onClick={() => navigate('/entrepreneur/pitch-card')}
                className="bg-blue-600 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all text-left group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg md:text-xl">New Project</h3>
                <p className="text-blue-100 text-xs md:text-sm mt-1">Launch your next vision</p>
              </button>

              <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Avg. Progress</p>
                <p className="text-2xl md:text-3xl font-black text-slate-900 mt-1">68%</p>
              </div>

              <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm text-white">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-4">
                  <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                </div>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Account Status</p>
                <p className="text-base md:text-lg font-bold text-blue-400 mt-1 flex items-center gap-2">
                    Verified <LayoutDashboard className="w-4 h-4" />
                </p>
              </div>
            </div>

            {/* Projects Section */}
            <div>
              <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
                <h2 className="text-lg md:text-xl font-bold text-slate-900">Active Pitches</h2>
                <span className="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] md:text-xs font-bold rounded-full">
                  {userProjects.length} Total
                </span>
              </div>

              {userProjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {userProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => navigate(`/entrepreneur/project/${project.id}`)}
                      className="group bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-5 hover:border-blue-200 cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row items-center gap-4 md:gap-6"
                    >
                      <div className="w-full md:w-40 h-32 md:h-28 rounded-[1.2rem] md:rounded-[1.8rem] overflow-hidden shadow-inner flex-shrink-0">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-center mb-3 md:mb-4">
                          <h3 className="text-lg md:text-xl font-bold text-slate-900 truncate pr-2">{project.name}</h3>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                          <div>
                            <p className="text-[9px] md:text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Raised</p>
                            <p className="text-sm md:text-base font-bold text-blue-600">{formatCurrency(project.raised)}</p>
                          </div>
                          <div className="hidden sm:block">
                            <p className="text-[9px] md:text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Funding Goal</p>
                            <p className="text-sm md:text-base font-bold text-slate-700">{formatCurrency(project.fundingGoal)}</p>
                          </div>
                          <div className="col-span-1 md:w-full">
                             <p className="text-[9px] md:text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Progress</p>
                             <div className="flex items-center gap-2 md:gap-3">
                                <div className="flex-1 h-1.5 md:h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-600 transition-all duration-1000" style={{width: `${(project.raised/project.fundingGoal)*100}%`}}></div>
                                </div>
                                <span className="text-[10px] md:text-xs font-black text-slate-900">{Math.round((project.raised/project.fundingGoal)*100)}%</span>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 md:py-24 bg-white rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-slate-200 px-6">
                  <p className="text-slate-400 mb-6 font-medium text-sm md:text-base">No active pitches found.</p>
                  <button
                    onClick={() => navigate('/entrepreneur/pitch-card')}
                    className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-100"
                  >
                    Create Your First Pitch
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Investor View */}
        {user.role === 'investor' && (
          <div className="py-12 md:py-20 text-center px-4">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner">
              <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Invest in the Future</h2>
            <p className="text-sm md:text-lg text-slate-500 max-w-md mx-auto mb-8 md:mb-10 leading-relaxed">
              Discover verified Rwandan ventures ready for scale. Your capital can drive real impact.
            </p>
            <button
              onClick={() => navigate('/investor/discover')}
              className="w-full sm:w-auto px-12 py-5 bg-slate-900 hover:bg-blue-900 text-white font-bold rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95"
            >
              Explore Opportunities
            </button>
          </div>
        )}
      </div>
    </div>
  );
}