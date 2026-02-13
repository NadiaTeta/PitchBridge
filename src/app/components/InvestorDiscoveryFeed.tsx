import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, CheckCircle2, Award, Heart } from 'lucide-react';
import { mockProjects, categories } from '@/app/data/mockData';
import { useAuth } from '@/app/context/AuthContext';

export function InvestorDiscoveryFeed() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleWatchlist = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (!user) return;

    const currentWatchlist = user.watchlist || [];
    const isWatched = currentWatchlist.includes(projectId);
    
    const updatedWatchlist = isWatched
      ? currentWatchlist.filter(id => id !== projectId)
      : [...currentWatchlist, projectId];

    updateUser({ watchlist: updatedWatchlist });
  };

  const filteredProjects = mockProjects.filter((project) => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      {/* Header & Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="p-4 max-w-7xl mx-auto">
          {/* Search Bar - Full width on mobile */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project or location..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm md:text-base"
            />
          </div>

          {/* Horizontal Scrolling Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex items-center justify-center bg-gray-100 p-2 rounded-lg md:bg-transparent md:p-0">
               <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Sectors
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs md:text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredProjects.map((project) => {
          const isFavorited = user?.watchlist?.includes(project.id);
          
          return (
            <div
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 relative flex flex-col"
            >
              {/* Heart Button - larger touch target on mobile */}
              <button 
                onClick={(e) => toggleWatchlist(e, project.id)}
                className={`absolute top-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md transition-all ${
                  isFavorited ? 'bg-red-500 text-white' : 'bg-black/20 text-white hover:bg-black/40'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>

              <div className="relative h-48 md:h-52 overflow-hidden flex-shrink-0">
                <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  {project.verified.nid && (
                    <div className="bg-blue-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 md:p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="min-w-0"> {/* Prevents text overflow */}
                    <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight truncate">{project.name}</h3>
                    <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1 mt-1">📍 {project.location}</p>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-[10px] md:text-xs font-bold flex-shrink-0">
                    {Math.round((project.raised / project.fundingGoal) * 100)}%
                  </div>
                </div>

                <div className="my-3 md:my-4">
                  <div className="h-1.5 md:h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                      style={{ width: `${(project.raised / project.fundingGoal) * 100}%` }} 
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] md:text-xs font-bold text-blue-600">{formatCurrency(project.raised)}</span>
                    <span className="text-[10px] md:text-xs text-gray-400">Goal: {formatCurrency(project.fundingGoal)}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mt-auto">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-3.5 h-3.5 text-yellow-600" />
                    <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">Investor ROI</span>
                  </div>
                  <p className="text-[11px] md:text-xs text-gray-700 line-clamp-2 italic leading-relaxed">"{project.roi}"</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}