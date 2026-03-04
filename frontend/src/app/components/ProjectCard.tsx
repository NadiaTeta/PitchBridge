import { Heart, Send, MapPin, Award, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjectActions } from '../hooks/useProjectActions';

// Enhanced interface to match your real DB data
interface Project {
  id: string;
  _id?: string;
  name: string;
  description: string;
  location: string;
  fundingGoal: number;
  raised: number;
  roi?: string;
  verified?: {
    nid: boolean;
    rdb: boolean;
  };
}

export function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleWatchlist } = useProjectActions();

  // Safety checks for IDs and formatting
  const projectId = project.id || project._id || '';
  const isFavorited = user?.watchlist?.includes(projectId);
  
  // Logic to check if connected (checks if project is in user's portfolio)
  const isConnected = user?.portfolio?.some(
    (item: any) => (item.project?._id || item.project || item) === projectId
  );

  const progress = Math.round((project.raised / project.fundingGoal) * 100);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div 
      onClick={() => navigate(`/project/${projectId}`)}
      className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Header: badge + location (no image) */}
      <div className="relative px-4 pt-4 pb-3 bg-slate-100 flex-shrink-0 flex flex-wrap items-center justify-between gap-2">
        {project.verified?.nid && (
          <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </div>
        )}
        <div className="px-3 py-1 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-slate-200">
          <MapPin className="w-3 h-3 text-blue-600" />
          {project.location}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-slate-900 truncate pr-2">{project.name}</h3>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-[10px] font-black">
            {progress}%
          </div>
        </div>
        
        {/* ROI Highlight - Makes it look professional */}
        <div className="flex items-center gap-1.5 mt-1 mb-4">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-[11px] font-bold text-slate-500 italic truncate">
            {project.roi || "ROI TBD"}
          </span>
        </div>

        {/* Funding Progress */}
        <div className="mb-6">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-black text-blue-600">{formatCurrency(project.raised)}</span>
            <span className="text-[10px] font-black text-slate-400">Goal: {formatCurrency(project.fundingGoal)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(projectId);
            }}
            className={`p-3.5 rounded-2xl border transition-all active:scale-90 ${
              isFavorited 
                ? 'bg-red-50 border-red-100 text-red-500 shadow-inner' 
                : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          <button 
            disabled={isConnected}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
              isConnected
                ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-200'
                : 'bg-blue-600 text-white hover:bg-slate-900 shadow-lg shadow-blue-100 active:scale-95'
            }`}
          >
            {isConnected ? (
              <>
                <Clock className="w-3 h-3" />
                Connection Requested
              </>
            ) : (
              <>
                Connect <Send className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}