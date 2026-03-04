import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2, Award, MessageCircle, TrendingUp, Calendar, ShieldCheck } from 'lucide-react';
import { mockProjects } from '../data/mockData';
import api from '../services/api';

export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConnectionRequest, setShowConnectionRequest] = useState(false);

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data.project);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
   );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRequestConnect = async () => {
    try {
      setIsRequested(true);
      await api.post('/users/portfolio/add', { projectId: project._id });
      const { data } = await api.post('/chat', { projectId:project._id });
      navigate(`/messages/${data.chat._id}`);
    } catch (error) {
      setIsRequested(false);
      console.error('Could not initiate chat', error);
    }
  };

  const progressPercentage = Math.round((project.raised / project.fundingGoal) * 100);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      
      {/* Back Button - Positioned carefully for mobile thumbs */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2.5 md:p-3 bg-white/90 backdrop-blur-md hover:bg-white text-slate-900 shadow-xl rounded-xl md:rounded-2xl border border-slate-200 transition-all active:scale-95 group"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Hero Section (no image) */}
      <div className="relative w-full bg-gradient-to-br from-slate-800 to-slate-900 pt-24 pb-10 md:pt-28 md:pb-12">
        <div className="w-full px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
               <span className="px-2.5 py-1 bg-blue-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg">
                 {project.category || 'Venture'}
               </span>
            </div>
            <h1 className="text-2xl md:text-5xl font-black text-white mb-2 md:mb-3 tracking-tight leading-tight">
              {project.name}
            </h1>
            {project.entrepreneur && (
              <p className="text-slate-200 text-sm md:text-base mb-2">
                By <span className="font-semibold text-white">{project.entrepreneur.name}</span>
              </p>
            )}
            <div className="flex items-center gap-2 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-sm md:text-base font-medium">{project.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-6 md:-mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description Card */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
              <h3 className="text-slate-900 font-bold text-lg md:text-xl mb-4">About Project</h3>
              <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                {project.description}
              </p>
              
              {project.entrepreneur && (
                <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Project owner</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600 font-black text-sm md:text-base">
                      {project.entrepreneur.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-bold text-slate-900">
                        {project.entrepreneur.name}
                      </p>
                      {(project.entrepreneur._id || project.entrepreneur.id) && (
                        <button
                          onClick={() => navigate(`/profile/${project.entrepreneur._id || project.entrepreneur.id}/public`)}
                          className="text-xs md:text-sm font-semibold text-blue-600 hover:underline mt-1"
                        >
                          View profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ROI Card */}
            <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-xl text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block">
                <TrendingUp className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 md:p-2 bg-blue-500 rounded-lg">
                    <TrendingUp className="w-4 h-4 md:w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl">Investment Return</h3>
                </div>
                <p className="text-slate-300 text-sm md:text-lg leading-relaxed">{project.roi}</p>
              </div>
            </div>
          </div>

          {/* Sidebar Stats (Right on Desktop, Bottom on Mobile) */}
          <div className="space-y-6">
            
            {/* Funding Progress Card */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-end mb-4">
                <span className="text-3xl md:text-4xl font-black text-slate-900">{progressPercentage}%</span>
                <span className="text-[10px] md:text-sm font-bold text-slate-400 pb-1 uppercase">Funded</span>
              </div>
              
              <div className="h-2 md:h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between lg:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Raised</p>
                  <p className="text-lg md:text-xl font-bold text-blue-600">{formatCurrency(project.raised)}</p>
                </div>
                <div className="h-px bg-slate-50" />
                <div className="flex justify-between lg:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Goal</p>
                  <p className="text-lg md:text-xl font-bold text-slate-900">{formatCurrency(project.fundingGoal)}</p>
                </div>
              </div>

              <button
                onClick={handleRequestConnect}
                disabled={showConnectionRequest}
                className="w-full mt-6 md:mt-8 py-3.5 md:py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl md:rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 text-sm md:text-base"
              >
                <MessageCircle className="w-4 h-4 md:w-5" />
                <span>{showConnectionRequest ? 'Sent!' : 'Request Connect'}</span>
              </button>
            </div>

            {/* Verification Badges Card */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 shadow-sm border border-slate-100">
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Trust Score</h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {project.verified.nid && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl text-blue-700 border border-blue-100">
                      <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                      <span className="text-xs md:text-sm font-bold">Identity Verified</span>
                    </div>
                  )}
                  {project.verified.rdb && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-100">
                      <Award className="w-5 h-5 flex-shrink-0" />
                      <span className="text-xs md:text-sm font-bold">Business Registered</span>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}