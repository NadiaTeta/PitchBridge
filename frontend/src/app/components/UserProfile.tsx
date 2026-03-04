import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Award,
  FileText,
  Settings,
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
  Camera,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { handleApiError } from '../utils/errorHandler';
import { uploadDocument } from '../utils/fileUpload';

interface UserProfileData {
  _id: string;
  name: string;
  email: string;
  role: 'entrepreneur' | 'investor';
  bio?: string;
  location?: string;
  phone?: string;
  profilePicture?: string;
  verified: {
    nid: boolean;
    tin: boolean;
    rdb: boolean;
  };
  verificationLevel: string;
  accountStatus: string;
  emailVerified: boolean;
  documentsUploaded: boolean;
  accountApproved: boolean;
  totalInvested?: number;
  totalFundingRaised?: number;
  projects?: string[];
  portfolio?: any[];
  createdAt: string;
}

interface Project {
  _id: string;
  name: string;
  raised: number;
  fundingGoal: number;
  image?: string;
}

type ViewType = 'public' | 'private' | 'admin';

export function UserProfile() {
  const { id, viewType = 'private' } = useParams<{ id?: string; viewType?: ViewType }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const isOwnProfile = !id || id === currentUser?.id;
  const view: ViewType = (viewType as ViewType) || (isOwnProfile ? 'private' : 'public');
  
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    bio: '',
    location: '',
    phone: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  useEffect(() => {
    if (user) {
      setEditedProfile({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profileId = id || currentUser?.id;
      
      if (!profileId) {
        throw new Error('No user ID available');
      }

      const { data } = await api.get(`/users/profile/${profileId}`);
      setUser(data.user);

      // Fetch user's projects if entrepreneur
      if (data.user.role === 'entrepreneur' && data.user.projects?.length > 0) {
        await fetchUserProjects(data.user.projects);
      }

      // Fetch portfolio if investor
      if (data.user.role === 'investor') {
        await fetchPortfolio();
      }
    } catch (error) {
      console.error('Error fetching profile:', handleApiError(error));
      alert('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProjects = async (projectIds: string[]) => {
    try {
      // Fetch each project
      const projectPromises = projectIds.map(projectId => 
        api.get(`/projects/${projectId}`).catch(() => null)
      );
      const projectResults = await Promise.all(projectPromises);
      const validProjects = projectResults
        .filter(result => result !== null && result.data?.project)
        .map(result => result.data.project);
      setProjects(validProjects);
    } catch (error) {
      console.error('Error fetching projects:', handleApiError(error));
    }
  };

  const fetchPortfolio = async () => {
    try {
      const { data } = await api.get('/users/portfolio');
      const portfolioProjects = data.portfolio
        .map((inv: any) => inv.project)
        .filter(p => p);
      setProjects(portfolioProjects);
    } catch (error) {
      console.error('Error fetching portfolio:', handleApiError(error));
    }
  };

  const handleSaveProfile = async () => {
    try {
      await api.put('/users/profile', editedProfile);
      setUser(prev => prev ? { ...prev, ...editedProfile } : null);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert(handleApiError(error));
    }
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('profilePicture', file);
        
        const response = await api.post('/users/profile-picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setUser(prev => prev ? { ...prev, profilePicture: response.data.profilePicture } : null);
        alert('Profile picture updated!');
      } catch (error) {
        alert(handleApiError(error));
      }
    };
    
    input.click();
  };

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case 'Gold':
        return { label: 'Gold Verified', color: 'bg-yellow-500/30 text-yellow-100 border-yellow-400/30' };
      case 'Silver':
        return { label: 'Silver Verified', color: 'bg-slate-400/30 text-slate-100 border-slate-400/30' };
      case 'Bronze':
        return { label: 'Bronze Verified', color: 'bg-orange-500/30 text-orange-100 border-orange-400/30' };
      default:
        return { label: 'Unverified', color: 'bg-slate-500/30 text-slate-100 border-slate-400/30' };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-500 mb-4">User not found</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const badge = getVerificationBadge(user.verificationLevel);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      
      {/* Visual Header & Hero Section */}
      <div className="relative h-72 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 md:rounded-b-[3rem] shadow-2xl">
        
        {/* Floating Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white transition-all active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Floating Actions */}
        <div className="absolute top-6 right-6 z-20 flex gap-2">
          {isOwnProfile && view === 'private' && (
            <>
              <button
                onClick={() => {
                  if (editMode) {
                    handleSaveProfile();
                  } else {
                    setEditMode(true);
                  }
                }}
                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white transition-all"
              >
                {editMode ? <CheckCircle2 className="w-6 h-6" /> : <Edit className="w-6 h-6" />}
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white transition-all"
              >
                <Settings className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Profile Identity Overlay */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 flex flex-col md:flex-row items-center gap-6">
          
          {/* Avatar with Upload Icon */}
          <div className="relative group">
            <div className="w-40 h-40 bg-white rounded-[2.5rem] p-1.5 shadow-2xl">
              {user.profilePicture ? (
                <img 
                  src={`http://localhost:5000${user.profilePicture}`}
                  alt={user.name}
                  className="w-full h-full rounded-[2.2rem] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-slate-100 to-slate-200 rounded-[2.2rem] flex items-center justify-center border border-slate-100">
                  <span className="text-5xl font-black text-blue-900/20">{user.name.charAt(0)}</span>
                </div>
              )}
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
            {editMode ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                className="text-4xl font-black text-white bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 mb-2 border border-white/20"
              />
            ) : (
              <h1 className="text-4xl font-black text-white drop-shadow-md">{user.name}</h1>
            )}
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${badge.color}`}>
                {badge.label}
              </span>
              <p className="flex items-center gap-1 text-slate-300 text-sm">
                <MapPin className="w-3 h-3" /> {user.location || 'Rwanda'}
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
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Profile Bio</label>
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Location</label>
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Phone</label>
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    placeholder="+250 XXX XXX XXX"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
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
                <p className="text-slate-600 leading-relaxed text-lg mb-8">
                  {user.bio || 'No bio provided yet.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 capitalize">{user.role}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Portfolio Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-900 text-xl">
                {user.role === 'entrepreneur' ? 'Active Projects' : 'Investment Portfolio'}
              </h3>
              {isOwnProfile && user.role === 'entrepreneur' && (
                <button 
                  onClick={() => navigate('/entrepreneur/pitch-card')} 
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors"
                >
                  New Project
                </button>
              )}
            </div>
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/project/${project._id}`)}
                    className="group p-6 border border-slate-100 rounded-[1.8rem] hover:border-blue-200 hover:bg-blue-50/20 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{project.name}</h4>
                        <p className="text-sm text-slate-500">{formatCurrency(project.raised)} raised</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-blue-50 rounded-xl">
                      <span className="text-xs font-black text-blue-700">
                        {Math.round((project.raised / project.fundingGoal) * 100)}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">
                    {user.role === 'entrepreneur' ? 'No projects yet' : 'No investments yet'}
                  </p>
                </div>
              )}
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
            
            {/* Account Status */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user.accountStatus === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {user.accountStatus}
                </span>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Email Verified</span>
                  {user.emailVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Documents Uploaded</span>
                  {user.documentsUploaded ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Admin Approved</span>
                  {user.accountApproved ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" /> Performance
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {user.role === 'investor' ? 'Total Invested' : 'Total Raised'}
                </p>
                <p className="text-3xl font-black text-white">
                  {formatCurrency(user.totalInvested || user.totalFundingRaised || 0)}
                </p>
              </div>
              <div className="h-px bg-slate-800 w-full" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Member Since</p>
                <p className="text-xl font-bold text-blue-400">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Verification Level</p>
                <p className="text-xl font-bold text-blue-400">{user.verificationLevel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}