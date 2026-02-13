import { Heart, Send, MapPin } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useProjectActions } from '@/app/hooks/useProjectActions';

// Define what a project looks like
interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  fundingGoal: number;
  raised: number;
}

export function ProjectCard({ project }: { project: Project }) {
  const { user } = useAuth();
  const { toggleWatchlist, connectToProject } = useProjectActions();

  // Determine current status based on AuthContext arrays
  const isFavorited = user?.watchlist?.includes(project.id);
  const isConnected = user?.portfolio?.includes(project.id);

  const progress = Math.round((project.raised / project.fundingGoal) * 100);

  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
          <MapPin className="w-3 h-3 text-blue-600" />
          {project.location}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{project.name}</h3>
        
        {/* Funding Progress */}
        <div className="mt-4 mb-6">
          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
            <span>{progress}% Funded</span>
            <span className="text-slate-900">Goal: {(project.fundingGoal / 1000000).toFixed(1)}M</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* HEART -> WATCHLIST */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(project.id);
            }}
            className={`p-3.5 rounded-2xl border transition-all active:scale-90 ${
              isFavorited 
                ? 'bg-red-50 border-red-100 text-red-500 shadow-inner' 
                : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          {/* CONNECT -> PORTFOLIO */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              connectToProject(project.id);
            }}
            disabled={isConnected}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 ${
              isConnected
                ? 'bg-slate-900 text-blue-400 cursor-default'
                : 'bg-blue-600 text-white hover:bg-slate-900 shadow-lg shadow-blue-100'
            }`}
          >
            {isConnected ? 'Requested' : 'Connect'}
            {!isConnected && <Send className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}