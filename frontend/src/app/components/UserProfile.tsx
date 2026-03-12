import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Camera,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  Briefcase,
  Shield,
  Save,
  X,
  Settings,
  Star,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { handleApiError } from '../utils/errorHandler';

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

  useEffect(() => { fetchUserProfile(); }, [id]);

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
      if (!profileId) throw new Error('No user ID available');
      const { data } = await api.get(`/users/profile/${profileId}`);
      setUser(data.user);
      if (data.user.role === 'entrepreneur' && data.user.projects?.length > 0) {
        await fetchUserProjects(data.user.projects);
      }
      if (data.user.role === 'investor') await fetchPortfolio();
    } catch (error) {
      console.error('Error fetching profile:', handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProjects = async (projectIds: string[]) => {
    try {
      const projectPromises = projectIds.map(projectId =>
        api.get(`/projects/${projectId}`).catch(() => null)
      );
      const projectResults = await Promise.all(projectPromises);
      const validProjects = projectResults
        .filter((result): result is Exclude<typeof result, null> => result !== null && result.data?.project)
        .map((result) => result.data?.project)
        .filter((p): p is NonNullable<typeof p> => p != null);
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
        .filter((p: any) => p);
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
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setUser(prev => prev ? { ...prev, profilePicture: response.data.profilePicture } : null);
      } catch (error) {
        alert(handleApiError(error));
      }
    };
    input.click();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(amount);

  const getVerificationStyle = (level: string) => {
    switch (level) {
      case 'Gold':   return { dot: 'bg-amber-400',  text: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200' };
      case 'Silver': return { dot: 'bg-slate-400',  text: 'text-slate-600',  bg: 'bg-slate-50 border-slate-200' };
      case 'Bronze': return { dot: 'bg-orange-400', text: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' };
      default:       return { dot: 'bg-slate-300',  text: 'text-slate-500',  bg: 'bg-slate-50 border-slate-200' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
        <div className="text-center">
          <p className="text-slate-500 mb-4">User not found</p>
          <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const vStyle = getVerificationStyle(user.verificationLevel);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>

      {/* ── HERO BANNER ── */}
      <div className="relative h-48 md:h-52 overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8edf5 0%, #dde6f0 50%, #e4eaf4 100%)' }}>
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(ellipse at 10% 50%, #bfdbfe 0%, transparent 60%),
                              radial-gradient(ellipse at 90% 20%, #c7d2fe 0%, transparent 50%)`
          }}
        />
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2393afd4' fill-opacity='0.25' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 z-10 flex items-center gap-2 px-3 py-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-xl text-slate-700 text-sm font-medium transition-all border border-white/60 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Top-right actions */}
        {isOwnProfile && view === 'private' && (
          <div className="absolute top-5 right-5 z-10 flex gap-2">
            {editMode ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="p-2 bg-white/60 hover:bg-white/80 text-slate-600 rounded-xl transition-all border border-white/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm text-slate-700 rounded-xl text-sm font-semibold transition-all border border-white/60 shadow-sm"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="p-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm text-slate-600 rounded-xl transition-all border border-white/60 shadow-sm"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── IDENTITY STRIP ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 mb-8 pb-6 border-b border-slate-200">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-slate-100">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0f172a&color=fff&size=200`;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <span className="text-3xl font-black text-white">{user.name.charAt(0)}</span>
                </div>
              )}
            </div>
            {isOwnProfile && (
              <button
                onClick={handleImageUpload}
                className="absolute -bottom-1.5 -right-1.5 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all border-2 border-white"
              >
                <Camera className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Name + tags */}
          <div className="flex-1 sm:pb-1">
            {editMode ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                className="text-2xl font-black text-slate-900 bg-white border border-slate-200 rounded-xl px-3 py-1.5 mb-2 w-full max-w-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{user.name}</h1>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="capitalize text-xs text-slate-500 font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                {user.role}
              </span>
              <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${vStyle.bg} ${vStyle.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${vStyle.dot}`} />
                {user.verificationLevel} Verified
              </span>
              {user.location && (
                <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                  <MapPin className="w-3 h-3" /> {user.location}
                </span>
              )}
            </div>
          </div>

          {/* Right meta */}
          <div className="hidden sm:flex flex-col items-end gap-1.5 pb-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3 h-3" />
              Since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              user.accountStatus === 'active'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {user.accountStatus}
            </span>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-16">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-5">

            {/* About */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-50">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">About</h2>
              </div>
              <div className="p-6">
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Bio</label>
                      <textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm text-slate-700"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Location</label>
                        <input
                          type="text"
                          value={editedProfile.location}
                          onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                          placeholder="City, Country"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Phone</label>
                        <input
                          type="tel"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                          placeholder="+250 XXX XXX XXX"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <p className="text-slate-600 leading-relaxed text-[15px]">
                      {user.bio || <span className="text-slate-300 italic">No bio provided yet.</span>}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { icon: Mail, label: user.email },
                        { icon: Briefcase, label: user.role, capitalize: true },
                        ...(user.phone ? [{ icon: Phone, label: user.phone }] : []),
                        ...(user.location ? [{ icon: MapPin, label: user.location }] : []),
                      ].map(({ icon: Icon, label, capitalize }, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className={`text-sm text-slate-600 truncate ${capitalize ? 'capitalize' : ''}`}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Projects / Portfolio */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {user.role === 'entrepreneur' ? 'Active Projects' : 'Investment Portfolio'}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                    {projects.length}
                  </span>
                  {isOwnProfile && user.role === 'entrepreneur' && (
                    <button
                      onClick={() => navigate('/entrepreneur/pitch-card')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                    >
                      New <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4">
                {projects.length > 0 ? (
                  <div className="space-y-1.5">
                    {projects.map((project) => {
                      const pct = Math.min(Math.round((project.raised / project.fundingGoal) * 100), 100);
                      return (
                        <div
                          key={project._id}
                          onClick={() => navigate(`/project/${project._id}`)}
                          className="group flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            {project.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                              {project.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-slate-400 font-medium">{pct}%</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-slate-900">{formatCurrency(project.raised)}</p>
                            <p className="text-xs text-slate-400">raised</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3">
                      <Briefcase className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-400 font-medium">
                      {user.role === 'entrepreneur' ? 'No projects yet' : 'No investments yet'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">

            {/* Performance */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
              <div className="px-5 pt-5 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Performance</span>
                </div>
                <p className="text-3xl font-black text-white">
                  {formatCurrency(user.totalInvested || user.totalFundingRaised || 0)}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {user.role === 'investor' ? 'Total invested' : 'Total raised'}
                </p>
              </div>
              <div className="px-5 py-4 space-y-3">
                {[
                  { label: 'Level', value: user.verificationLevel, icon: Star, accent: true },
                  { label: 'Member since', value: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), accent: false },
                  { label: 'Projects', value: String(projects.length), accent: false },
                ].map(({ label, value, accent }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{label}</span>
                    <span className={`text-sm font-bold ${accent ? 'text-blue-400' : 'text-slate-300'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credentials */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Credentials</h3>
              </div>
              <div className="p-4 space-y-2">
                {(['nid', 'tin', 'rdb'] as const).map((type) => {
                  const ok = user.verified[type];
                  return (
                    <div key={type} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${ok ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{type}</span>
                      {ok ? (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs font-bold">Verified</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-slate-300">Pending</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="px-4 pb-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                  {[
                    { label: 'Email verified', ok: user.emailVerified },
                    { label: 'Documents uploaded', ok: user.documentsUploaded },
                    { label: 'Admin approved', ok: user.accountApproved, warn: !user.accountApproved },
                  ].map(({ label, ok, warn }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">{label}</span>
                      {ok ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : warn ? (
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}