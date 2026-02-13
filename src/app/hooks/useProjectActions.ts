import { useAuth } from '@/app/context/AuthContext';

export function useProjectActions() {
  const { user, updateUser } = useAuth();

  const toggleWatchlist = (projectId: string) => {
    if (!user) return;
    
    const isWatched = user.watchlist?.includes(projectId);
    const updatedWatchlist = isWatched
      ? user.watchlist.filter(id => id !== projectId)
      : [...(user.watchlist || []), projectId];

    updateUser({ watchlist: updatedWatchlist });
  };

  const connectToProject = (projectId: string) => {
    if (!user) return;

    // 1. Add to Portfolio
    const updatedPortfolio = [...(user.portfolio || []), projectId];
    
    // 2. Remove from Watchlist automatically (since it's now a serious connection)
    const updatedWatchlist = (user.watchlist || []).filter(id => id !== projectId);

    updateUser({ 
      portfolio: updatedPortfolio,
      watchlist: updatedWatchlist 
    });
    
    alert("Connection request sent! Moved to Portfolio.");
  };

  return { toggleWatchlist, connectToProject };
}