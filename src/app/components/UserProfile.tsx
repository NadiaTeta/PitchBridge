import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Award,
  FileText,
  Settings,
  LogOut,
  Edit,
  Upload,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Ban,
  UserX,
  TrendingUp,
  Briefcase,
  Shield,
  Camera, // Added for the profile picture upload
} from 'lucide-react';
import { currentUser, mockInvestorProfile, getVerificationBadge, UserProfileData } from '@/app/data/userData';
import { mockProjects } from '@/app/data/mockData';

type ViewType = 'public' | 'private' | 'admin';

export function UserProfile() {
  const { id, viewType = 'private' } = useParams<{ id: string; viewType?: ViewType }>();
  const navigate = useNavigate();
  
  const isOwnProfile = !id || id === currentUser.id;
  const user: UserProfileData = isOwnProfile ? currentUser : mockInvestorProfile;
  const view: ViewType = (viewType as ViewType) || (isOwnProfile ? 'private' : 'public');
  
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState(user);

  const badge = getVerificationBadge(user.verificationLevel);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSaveProfile = () => {
    setEditMode(false);
    alert('Profile updated successfully!');
  };

  const handleImageUpload = () => {
    alert('Opening file picker for profile picture...');
  };

  const userProjects = user.projects?.map((projectId) => 
    mockProjects.find((p) => p.id === projectId)
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      
      {/* Visual Header & Hero Section - Switched to Blue/Slate Gradient */}
      <div className="relative h-72 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 md:rounded-b-[3rem] shadow-2xl">
        
        {/* Floating Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white transition-all active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Floating Action (Edit or Logout) */}
        <div className="absolute top-6 right-6 z-20 flex gap-2">
           {view === 'private' && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white transition-all"
            >
              {editMode ? <CheckCircle2 className="w-6 h-6" /> : <Edit className="w-6 h-6" />}
            </button>
          )}
          <button 
            onClick={() => navigate('/')} 
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Identity Overlay */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 flex flex-col md:flex-row items-center gap-6">
          
          {/* Avatar with Upload Icon */}
          <div className="relative group">
            <div className="w-40 h-40 bg-white rounded-[2.5rem] p-1.5 shadow-2xl">
               <div className="w-full h-full bg-gradient-to-tr from-slate-100 to-slate-200 rounded-[2.2rem] flex items-center justify-center border border-slate-100 overflow-hidden">
                  <span className="text-5xl font-black text-blue-900/20">{user.name.charAt(0)}</span>
               </div>
            </div>
            {isOwnProfile && (
              <button 
                onClick={handleImageUpload}
                className="absolute bottom-2 right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-xl border-4 border-white hover:bg-blue-700 transition-all active:scale-90"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="text-center md:text-left md:pb-4">
            <h1 className="text-4xl font-black text-white drop-shadow-md">{user.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/30 backdrop-blur-md text-blue-100 border border-blue-400/30">
                {badge.label}
              </span>
              <p className="flex items-center gap-1 text-slate-300 text-sm">
                <MapPin className="w-3 h-3" /> {user.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 px-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Bio & Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
             {editMode ? (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Profile Bio</label>
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-slate-900 font-bold text-xl mb-4">Professional Bio</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{user.bio}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                     <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="p-2 bg-white rounded-xl shadow-sm"><Mail className="w-5 h-5 text-blue-600" /></div>
                        <span className="text-sm font-semibold text-slate-700 truncate">{user.email}</span>
                     </div>
                     <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="p-2 bg-white rounded-xl shadow-sm"><Briefcase className="w-5 h-5 text-blue-600" /></div>
                        <span className="text-sm font-semibold text-slate-700 capitalize">{user.role}</span>
                     </div>
                  </div>
                </div>
              )}
          </div>

          {/* Portfolio Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-900 text-xl">Active Portfolio</h3>
                {view === 'private' && (
                  <button onClick={() => navigate('/entrepreneur/pitch-card')} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors">
                    New Project
                  </button>
                )}
             </div>
             <div className="space-y-4">
                {userProjects?.map((project) => (
                  <div
                    key={project?.id}
                    onClick={() => navigate(`/project/${project?.id}`)}
                    className="group p-6 border border-slate-100 rounded-[1.8rem] hover:border-blue-200 hover:bg-blue-50/20 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-blue-600">
                        {project?.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{project?.name}</h4>
                        <p className="text-sm text-slate-500">{formatCurrency(project?.raised || 0)} raised</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-blue-50 rounded-xl">
                      <span className="text-xs font-black text-blue-700">
                        {Math.round(((project?.raised || 0) / (project?.fundingGoal || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Verification & Stats */}
        <div className="space-y-6">
           {/* Credentials Card */}
           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" /> Verified Credentials
              </h3>
              <div className="space-y-3">
                 {['nid', 'tin', 'rdb'].map((type) => (
                   <div key={type} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{type}</span>
                      {user.verified[type as keyof typeof user.verified] ? (
                        <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
                           <CheckCircle2 className="w-4 h-4" />
                           <span>VERIFIED</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300">PENDING</span>
                      )}
                   </div>
                 ))}
              </div>
           </div>

           {/* Stats Card */}
           <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" /> Performance
              </h3>
              <div className="space-y-6">
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Impact</p>
                    <p className="text-3xl font-black text-white">{formatCurrency(user.totalInvested || 0)}</p>
                 </div>
                 <div className="h-px bg-slate-800 w-full" />
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Network Rank</p>
                    <p className="text-xl font-bold text-blue-400">Top 5% Investor</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}