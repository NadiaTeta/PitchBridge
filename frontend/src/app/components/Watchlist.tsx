import { useAuth } from '../context/AuthContext';
import { mockProjects } from '../data/mockData';
import { ProjectCard } from '../components/ProjectCard'; 
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HeartOff } from 'lucide-react';
import api from '../services/api';
import { useEffect, useState } from 'react';

// minimal project shape used in this component; add other fields as needed
interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  fundingGoal: number;
  currentFunding: number;
}

export function WatchlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filter projects: only show those whose ID is in the user's watchlist array
  const [watchedProjects, setWatchedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const { data } = await api.get(`/users/watchlist`);
        setWatchedProjects(data.watchlist);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setLoading(false);
      }    };

    fetchWatchlist();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 md:p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Your Watchlist</h1>
            <p className="text-slate-500 font-medium text-xs md:text-sm">Projects you are monitoring</p>
          </div>
        </div>

        {watchedProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {watchedProjects.map(project => (
              <ProjectCard key={project.id} project={project as any} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-10 md:p-20 border border-dashed border-slate-300 text-center shadow-sm">
            <div className="bg-slate-50 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <HeartOff className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-2">Your watchlist is empty</h2>
            <p className="text-sm text-slate-500 mb-6 md:mb-8 max-w-xs mx-auto">
              Heart projects in the discovery feed to keep track of them here.
            </p>
            <button 
              onClick={() => navigate('/investor/discover')}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-900 transition-all active:scale-95"
            >
              Browse Projects
            </button>
          </div>
        )}
      </div>
    </div>
  );
}