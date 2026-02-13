import { useAuth } from '@/app/context/AuthContext';
import { mockProjects } from '@/app/data/mockData';
import { ProjectCard } from '@/app/components/ProjectCard';

export function PortfolioPage() {
  const { user } = useAuth();

  const portfolioProjects = mockProjects.filter(project => 
    user?.portfolio?.includes(project.id)
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12 pt-8 md:pt-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 md:mb-2 tracking-tight">
          My Portfolio
        </h1>
        <p className="text-xs md:text-sm text-slate-500 font-medium mb-6 md:mb-8">
          Projects you have requested to connect with
        </p>
        
        {portfolioProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {portfolioProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-10 md:p-20 text-center border border-slate-200 shadow-sm">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              No connections found
            </p>
            <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">
              Once an entrepreneur accepts your request, the project will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}