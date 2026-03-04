import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  User,
  FileText,
  XCircle,
  Users,
  BarChart3,
  ShieldCheck,
  Clock,
  TrendingUp,
  Briefcase,
  DollarSign,
  Search,
  Eye,
  Ban,
  CheckCircle,
  MessageSquare,
  X,
  Shield,
  ChevronRight,
  MapPin
} from 'lucide-react';
import api from '../services/api';
import { handleApiError } from '../utils/errorHandler';

interface VerificationRequest {
  _id: string;
  name: string;
  entrepreneur: {
    _id: string;
    name: string;
    email: string;
    verified: {
      nid: boolean;
      tin: boolean;
      rdb: boolean;
    };
    documents: Array<{
      _id: string;
      type: string;
      status: string;
      azureUrl: string;
      fileName: string;
      uploadDate: string;
      rejectionReason?: string;
    }>;
  };
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'clarification_needed';
  category: string;
  location: string;
  fundingGoal: number;
  description: string;
  createdAt: string;
}

interface UserVerification {
  _id: string;
  name: string;
  email: string;
  role: string;
  documents: Array<{
    _id: string;
    type: string;
    status: string;
    azureUrl: string;
    fileName: string;
    uploadDate: string;
    rejectionReason?: string;
  }>;
  verified: {
    nid: boolean;
    tin: boolean;
    rdb: boolean;
  };
  verificationLevel: string;
  accountApproved: boolean;
  accountStatus: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalProjects: number;
  totalInvestments: number;
  pendingVerifications: number;
  pendingUsers?: number;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  accountStatus: 'active' | 'suspended' | 'deactivated';
  emailVerified: boolean;
  documentsUploaded: boolean;
  accountApproved: boolean;
  verificationLevel: string;
  createdAt: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'overview' | 'verifications' | 'users' | 'id-verification'>('overview');
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [pendingUsers, setPendingUsers] = useState<UserVerification[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserVerification | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'entrepreneur' | 'investor'>('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [clarificationNote, setClarificationNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [showUserRejectModal, setShowUserRejectModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchVerifications(),
        fetchUsers(),
        fetchPendingUsers()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', handleApiError(error));
    }
  };

  const fetchVerifications = async () => {
    try {
      const { data } = await api.get('/admin/verifications/pending');
      setVerificationRequests(data.projects || []);
      console.log('Fetched projects:', data.projects);
    } catch (error) {
      console.error('Error fetching verifications:', handleApiError(error));
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users || []);
      console.log('Fetched users:', data.users);
    } catch (error) {
      console.error('Error fetching users:', handleApiError(error));
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const { data } = await api.get('/admin/users/pending');
      setPendingUsers(data.users || []);
      console.log('Fetched pending users:', data.users);
    } catch (error) {
      console.error('Error fetching pending users:', handleApiError(error));
    }
  };

  // Project Verification Handlers
  const handleApproveProject = async (projectId: string) => {
    try {
      await api.put(`/admin/verifications/${projectId}/approve`);
      alert('Project approved successfully!');
      setSelectedRequest(null);
      fetchVerifications();
      fetchStats();
    } catch (error) {
      alert(handleApiError(error));
    }
  };

  const handleRejectProject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await api.put(`/admin/verifications/${selectedRequest._id}/reject`, {
        reason: rejectionReason
      });
      alert('Project rejected');
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedRequest(null);
      fetchVerifications();
      fetchStats();
    } catch (error) {
      alert(handleApiError(error));
    }
  };

  const handleRequestClarification = async () => {
    if (!selectedRequest || !clarificationNote.trim()) {
      alert('Please provide a clarification note');
      return;
    }

    try {
      await api.put(`/admin/verifications/${selectedRequest._id}/clarification`, {
        note: clarificationNote
      });
      alert('Clarification requested');
      setShowClarificationModal(false);
      setClarificationNote('');
      setSelectedRequest(null);
      fetchVerifications();
    } catch (error) {
      alert(handleApiError(error));
    }
  };

  // User ID Verification Handlers
  const handleApproveUser = async (userId: string) => {
    if (!confirm('Approve this user? All pending documents will be approved.')) return;

    try {
      await api.put(`/admin/users/${userId}/approve`);
      alert('User approved successfully!');
      setSelectedUser(null);
      fetchPendingUsers();
      fetchStats();
    } catch (error) {
      alert(handleApiError(error));
    }
  };

  const handleRejectUser = async () => {
    if (!selectedUser || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await api.put(`/admin/users/${selectedUser._id}/reject`, {
        reason: rejectionReason
      });
      alert('User rejected');
      setShowUserRejectModal(false);
      setRejectionReason('');
      setSelectedUser(null);
      fetchPendingUsers();
      fetchStats();
    } catch (error) {
      alert(handleApiError(error));
    }
  };

  const handleApproveDocument = async (userId: string, documentId: string) => {
    try {
      await api.put(`/admin/documents/${userId}/${documentId}/approve`);
      alert('Document approved');
      if (selectedUser) {
        const { data } = await api.get(`/admin/users/${selectedUser._id}`);
        setSelectedUser(data.user);
      }
      fetchPendingUsers();
    } catch (error) {
      alert(handleApiError(error));
    }
  };

  const handleRejectDocument = async (userId: string, documentId: string, reason: string) => {
    if (!reason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await api.put(`/admin/documents/${userId}/${documentId}/reject`, { reason });
      alert('Document rejected');
      if (selectedUser) {
        const { data } = await api.get(`/admin/users/${selectedUser._id}`);
        setSelectedUser(data.user);
      }
      fetchPendingUsers();
    } catch (error) {
      alert(handleApiError(error));
    }
  };

  const handleSuspendUser = async (userId: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;

    try {
      await api.put(`/admin/users/${userId}/suspend`);
      alert('User suspended');
      fetchUsers();
    } catch (error) {
      alert(handleApiError(error));
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await api.put(`/admin/users/${userId}/activate`);
      alert('User activated');
      fetchUsers();
    } catch (error) {
      alert(handleApiError(error));
    }
  };

  const filteredRequests = verificationRequests.filter(
    r => r.approvalStatus === selectedTab
  );

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

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
          <p className="mt-4 text-slate-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Admin Dashboard</h1>
                <p className="text-blue-200 text-sm mt-1">PitchBridge Management Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span className="font-bold text-sm">Administrator</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                activeView === 'overview'
                  ? 'bg-white text-blue-900 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveView('id-verification')}
              className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                activeView === 'id-verification'
                  ? 'bg-white text-blue-900 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Shield className="w-4 h-4" />
              ID Verification
              {stats && stats.pendingUsers && stats.pendingUsers > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.pendingUsers}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveView('verifications')}
              className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                activeView === 'verifications'
                  ? 'bg-white text-blue-900 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Clock className="w-4 h-4" />
              Projects
              {stats && stats.pendingVerifications > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.pendingVerifications}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveView('users')}
              className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                activeView === 'users'
                  ? 'bg-white text-blue-900 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Users className="w-4 h-4" />
              Users
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview View */}
        {activeView === 'overview' && stats && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Platform Statistics</h2>
              <p className="text-slate-600">Real-time overview of the PitchBridge platform</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Total Users
                </p>
                <p className="text-3xl font-black text-slate-900">{stats.totalUsers}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Briefcase className="w-6 h-6 text-green-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Total Projects
                </p>
                <p className="text-3xl font-black text-slate-900">{stats.totalProjects}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Investments
                </p>
                <p className="text-3xl font-black text-slate-900">{stats.totalInvestments}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 shadow-xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-white/80 uppercase tracking-widest mb-1">
                  Pending
                </p>
                <p className="text-3xl font-black">{stats.pendingVerifications + (stats.pendingUsers || 0)}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveView('id-verification')}
                  className="p-4 border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                >
                  <Shield className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-slate-900">ID Verifications</p>
                  <p className="text-sm text-slate-500 mt-1">{stats.pendingUsers || 0} pending</p>
                </button>
                <button
                  onClick={() => setActiveView('verifications')}
                  className="p-4 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <Clock className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-slate-900">Project Reviews</p>
                  <p className="text-sm text-slate-500 mt-1">{stats.pendingVerifications} pending</p>
                </button>
                <button
                  onClick={() => setActiveView('users')}
                  className="p-4 border-2 border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                >
                  <Users className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-slate-900">Manage Users</p>
                  <p className="text-sm text-slate-500 mt-1">{stats.totalUsers} total</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Project Verifications View */}
        {activeView === 'verifications' && (
          <div className="space-y-6">
            {!selectedRequest ? (
              <>
                {/* Status Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSelectedTab('pending')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                      selectedTab === 'pending'
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Pending ({verificationRequests.filter(r => r.approvalStatus === 'pending').length})
                  </button>
                  <button
                    onClick={() => setSelectedTab('approved')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                      selectedTab === 'approved'
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Approved ({verificationRequests.filter(r => r.approvalStatus === 'approved').length})
                  </button>
                  <button
                    onClick={() => setSelectedTab('rejected')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                      selectedTab === 'rejected'
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Rejected ({verificationRequests.filter(r => r.approvalStatus === 'rejected').length})
                  </button>
                </div>

                {/* Project List */}
                <div className="space-y-4">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <div
                        key={request._id}
                        onClick={() => setSelectedRequest(request)}
                        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-slate-100 hover:border-blue-300 group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                                {request.name}
                              </h3>
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                {request.category}
                              </span>
                            </div>
                            <p className="text-slate-600 mb-2">{request.entrepreneur.name}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(request.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {formatCurrency(request.fundingGoal)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {request.location}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                                request.approvalStatus === 'pending'
                                  ? 'bg-orange-100 text-orange-700'
                                  : request.approvalStatus === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : request.approvalStatus === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {request.approvalStatus === 'pending' && <Clock className="w-4 h-4" />}
                              {request.approvalStatus === 'approved' && <CheckCircle2 className="w-4 h-4" />}
                              {request.approvalStatus === 'rejected' && <XCircle className="w-4 h-4" />}
                              {request.approvalStatus === 'clarification_needed' && <MessageSquare className="w-4 h-4" />}
                              {request.approvalStatus.replace('_', ' ').toUpperCase()}
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white rounded-2xl">
                      <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">No {selectedTab} verification requests</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Project Detail View */
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-bold">Back to list</span>
                  </button>
                  <h2 className="text-2xl font-black mb-2">{selectedRequest.name}</h2>
                  <p className="text-blue-100">by {selectedRequest.entrepreneur.name}</p>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 p-6">
                  {/* Left Column - Project Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        Project Information
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Category</p>
                          <p className="text-slate-900 font-medium">{selectedRequest.category}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                          <p className="text-slate-900 font-medium">{selectedRequest.location}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Funding Goal</p>
                          <p className="text-2xl font-black text-blue-600">{formatCurrency(selectedRequest.fundingGoal)}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Description</p>
                          <p className="text-slate-700 text-sm leading-relaxed">{selectedRequest.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Entrepreneur Verification */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        Entrepreneur Verification
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Name</p>
                          <p className="text-slate-900 font-medium">{selectedRequest.entrepreneur.name}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                          <p className="text-slate-900 font-medium">{selectedRequest.entrepreneur.email}</p>
                        </div>

                        {/* Verification Status */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Verification Status</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-700">NID Verified</span>
                              {selectedRequest.entrepreneur.verified.nid ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-700">TIN Verified</span>
                              {selectedRequest.entrepreneur.verified.tin ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-700">RDB Verified</span>
                              {selectedRequest.entrepreneur.verified.rdb ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Documents */}
                        {selectedRequest.entrepreneur.documents && selectedRequest.entrepreneur.documents.length > 0 && (
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Uploaded Documents</p>
                            <div className="space-y-2">
                              {selectedRequest.entrepreneur.documents.map((doc) => (
                                <div key={doc._id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <div>
                                      <p className="text-sm font-medium text-slate-900">{doc.type.toUpperCase()}</p>
                                      <p className="text-xs text-slate-500">{doc.fileName}</p>
                                    </div>
                                  </div>
                                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                                    doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {doc.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-slate-200 p-6 bg-slate-50 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 sm:flex-initial px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-white transition-colors font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowClarificationModal(true)}
                    className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors font-bold flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Request Clarification</span>
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-bold flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApproveProject(selectedRequest._id)}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Approve Project</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users View */}
        {activeView === 'users' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as any)}
                  className="px-6 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Roles</option>
                  <option value="entrepreneur">Entrepreneurs</option>
                  <option value="investor">Investors</option>
                </select>
              </div>
            </div>

            {/* Users List */}
            {filteredUsers.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">User</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Verification</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Joined</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.role === 'entrepreneur' ? 'bg-purple-100 text-purple-700' :
                              user.role === 'investor' ? 'bg-blue-100 text-blue-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.accountStatus === 'active' ? 'bg-green-100 text-green-700' :
                              user.accountStatus === 'suspended' ? 'bg-red-100 text-red-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {user.accountStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {user.emailVerified && <CheckCircle className="w-4 h-4 text-green-500" title="Email Verified" />}
                              {user.documentsUploaded && <FileText className="w-4 h-4 text-blue-500" title="Documents Uploaded" />}
                              {user.accountApproved && <ShieldCheck className="w-4 h-4 text-purple-500" title="Account Approved" />}
                              {!user.emailVerified && !user.documentsUploaded && !user.accountApproved && (
                                <span className="text-xs text-slate-400">None</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/profile/${user._id}/public`)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {user.accountStatus === 'active' ? (
                                <button
                                  onClick={() => handleSuspendUser(user._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Suspend User"
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivateUser(user._id)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Activate User"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No users found</p>
                <p className="text-sm text-slate-400 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}

        {/* ID Verification View  */}
        {activeView === 'id-verification' && (
  <div className="space-y-6">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Pending ID Verifications</h2>
        <p className="text-slate-600">Review user documents and approve platform access</p>
      </div>
      <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-bold text-sm">
        {pendingUsers.length} Users Waiting
      </div>
    </div>

    <div className="grid gap-4">
      {pendingUsers.length > 0 ? (
        pendingUsers.map((user) => (
          <div 
            key={user._id} 
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
                  <p className="text-slate-500 text-sm">{user.email} • <span className="capitalize">{user.role}</span></p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${user.verified.nid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                  NID {user.verified.nid ? '✓' : '✗'}
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${user.verified.tin ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                  TIN {user.verified.tin ? '✓' : '✗'}
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${user.verified.rdb ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                  RDB {user.verified.rdb ? '✓' : '✗'}
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => handleApproveUser(user._id)}
                  className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowUserRejectModal(true);
                  }}
                  className="flex-1 md:flex-none px-4 py-2 bg-white text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>

            {user.documents && user.documents.length > 0 && (
              <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                  Submitted Documents
                </p>
                <div className="space-y-2">
                  {user.documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between bg-white rounded-lg px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {doc.type.toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-xs">
                          {doc.fileName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            doc.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : doc.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {doc.status}
                        </span>
                        {doc.azureUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDocument({
                                url: doc.azureUrl,
                                type: doc.type,
                                fileName: doc.fileName
                              });
                              setShowDocumentModal(true);
                            }}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <ShieldCheck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No pending user verifications at the moment</p>
        </div>
      )}
    </div>
  </div>
)}
      </div>

      {/* Modals */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-4">Reject Project</h3>
            <p className="text-slate-600 mb-4">Please provide a reason for rejection:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectProject}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-bold"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document preview modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-slate-900 truncate pr-4">
                {selectedDocument.fileName} ({selectedDocument.type.toUpperCase()})
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowDocumentModal(false);
                  setSelectedDocument(null);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="flex-1 min-h-0 p-4 overflow-auto bg-slate-100 flex items-center justify-center">
              {selectedDocument.url.toLowerCase().includes('.pdf') || selectedDocument.type === 'tin' ? (
                <iframe
                  src={selectedDocument.url}
                  title={selectedDocument.fileName}
                  className="w-full h-[70vh] rounded-xl border border-slate-200 bg-white"
                />
              ) : (
                <img
                  src={selectedDocument.url}
                  alt={selectedDocument.fileName}
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {showUserRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-4">Reject User</h3>
            <p className="text-slate-600 mb-4">Please provide a reason for rejection:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowUserRejectModal(false);
                  setRejectionReason('');
                  setSelectedUser(null);
                }}
                className="flex-1 px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectUser}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-bold"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {showClarificationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-4">Request Clarification</h3>
            <p className="text-slate-600 mb-4">What clarification do you need from the entrepreneur?</p>
            <textarea
              value={clarificationNote}
              onChange={(e) => setClarificationNote(e.target.value)}
              placeholder="Enter your clarification request..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowClarificationModal(false);
                  setClarificationNote('');
                }}
                className="flex-1 px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestClarification}
                className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors font-bold"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}