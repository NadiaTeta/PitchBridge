import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Trash2, Edit3, TrendingUp, BarChart3 } from 'lucide-react';
import { mockProjects } from '../data/mockData';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { handleApiError } from '../utils/errorHandler';

export function EntrepreneurProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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



  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Delete this pitch? This cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      alert('Project deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      alert(handleApiError(error));
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      
      {/* 1. Action Row - Optimized for Mobile Thumb Reach */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-6 md:pt-8 flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:bg-slate-50 active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-bold text-xs md:text-sm tracking-tight hidden sm:inline">Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/entrepreneur/pitch-card?edit=${id}`)} 
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-xl border border-slate-200 font-bold text-xs md:text-sm hover:shadow-md transition-all active:scale-95"
          >
            <Edit3 className="w-4 h-4 text-blue-600" />
            Edit Pitch
          </button>
          <button 
            onClick={handleDelete} 
            className="p-2.5 bg-white text-red-500 rounded-xl border border-slate-200 hover:bg-red-50 transition-all active:scale-95"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Main Page Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        
        {/* Hero Section (no image) */}
        <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200 mb-6 md:mb-8 bg-gradient-to-br from-slate-700 to-slate-800 p-6 md:p-8">
          <h1 className="text-xl md:text-3xl font-black text-white tracking-tight leading-tight">{project.name}</h1>
          <p className="text-slate-200 flex items-center gap-1 text-xs md:text-sm font-medium mt-2">
            <MapPin className="w-3.5 h-3.5" /> {project.location}
          </p>
        </div>

        {/* Management Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          
          {/* Funding Goal Card */}
          <div className="md:col-span-2 bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-900 text-sm md:text-base mb-2">Funding Goal</h3>
             <p className="text-2xl md:text-3xl font-black text-blue-600">{formatCurrency(project.fundingGoal)}</p>
          </div>

          {/* ROI Card - Stacks on mobile */}
          <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] p-6 text-white flex flex-col justify-center min-h-[120px]">
             <TrendingUp className="w-5 h-5 text-blue-400 mb-2" />
             <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ROI Strategy</p>
             <p className="text-xs md:text-sm font-medium leading-relaxed md:leading-snug">{project.roi}</p>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
           <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Project Executive Summary</h3>
           </div>
           <p className="text-slate-600 text-sm md:text-base leading-relaxed italic">
              {project.description}
           </p>
        </div>
      </div>
    </div>
  );
}