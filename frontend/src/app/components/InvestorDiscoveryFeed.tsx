import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Award,
  Heart,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { categories, rwandanDistricts } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { useProjectActions } from '../hooks/useProjectActions';

export function InvestorDiscoveryFeed() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { projects, loading, error } = useProjects({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    location: selectedLocation === 'all' ? undefined : selectedLocation,
    status: 'active',
  });

  const { toggleWatchlist } = useProjectActions();

  const handleToggleWatchlist = async (
    e: React.MouseEvent,
    projectId: string
  ) => {
    e.stopPropagation();
    try {
      await toggleWatchlist(projectId);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = searchQuery.toLowerCase();
      return (
        project.name.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query)
      );
    });
  }, [projects, searchQuery]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgress = (raised: number, fundingGoal: number) => {
    if (!fundingGoal || fundingGoal <= 0) return 0;
    return Math.min(Math.round((raised / fundingGoal) * 100), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700 mx-auto" />
          <p className="mt-4 text-base font-medium text-slate-700">
            Loading investment opportunities...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white border border-red-100 rounded-3xl p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-slate-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 px-5 py-3 rounded-2xl bg-blue-700 text-white font-semibold hover:bg-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col gap-5">

            {/* TITLE */}
            <div>
              <p className="text-sm uppercase tracking-widest text-blue-700 font-semibold">
                Discovery Feed
              </p>
              <h1 className="text-3xl font-bold text-slate-900 mt-1">
                Explore investment opportunities
              </h1>
              <p className="text-slate-500 mt-2 text-sm md:text-base">
                Discover verified founders across Rwanda
              </p>
            </div>

            {/* SEARCH + LOCATION */}
            <div className="grid md:grid-cols-[1fr_220px] gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none text-sm md:text-base"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none text-sm md:text-base"
                >
                  <option value="all">All locations</option>
                  {rwandanDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CATEGORY FILTER */}
            <div className="flex gap-2 overflow-x-auto">
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              </div>

              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-sm ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                All sectors
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm ${
                    selectedCategory === cat.id
                      ? 'bg-blue-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const id = project.id || project._id;
          const isFav = user?.watchlist?.includes(id);
          const progress = getProgress(project.raised, project.fundingGoal);

          return (
            <div
              key={id}
              onClick={() => navigate(`/project/${id}`)}
              className="group bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col"
            >
              {/* TOP */}
              <div className="p-5 border-b bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="flex justify-between items-start">

                  <div className="flex gap-2 flex-wrap">
                    {project.verified?.nid && (
                      <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}

                    <span className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleToggleWatchlist(e, id)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border ${
                      isFav
                        ? 'bg-red-50 text-red-500 border-red-200'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className="mt-4 text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-700">
                  {project.name}
                </h3>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <p className="text-sm text-slate-500">Raised</p>
                    <p className="font-bold text-slate-900">
                      {formatCurrency(project.raised)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Goal</p>
                    <p className="font-bold text-slate-900">
                      {formatCurrency(project.fundingGoal)}
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTTOM */}
              <div className="p-5 flex flex-col flex-1">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">
                      Funding Progress
                    </span>
                    <span className="font-bold text-blue-700">{progress}%</span>
                  </div>

                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-700 to-cyan-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-blue-700" />
                    <span className="text-sm font-semibold text-blue-700">
                      Investor ROI
                    </span>
                  </div>
                  <p className="text-sm text-slate-800">
                    {project.roi || 'ROI shared after due diligence'}
                  </p>
                </div>

                <div className="mt-auto pt-4 flex justify-between items-center border-t border-slate-100">
                  <span className="text-sm text-slate-600">
                    View details
                  </span>

                  <div className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-full group-hover:translate-x-1 transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}