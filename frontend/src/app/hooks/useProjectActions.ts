import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { handleApiError } from '../utils/errorHandler';

export function useProjectActions() {
  const { user, updateUser } = useAuth();

  const toggleWatchlist = async (projectId: string): Promise<void> => {
    if (!user) {
      throw new Error('Must be logged in');
    }

    try {
      const isWatched = user.watchlist?.includes(projectId);
      
      if (isWatched) {
        await api.delete(`/users/watchlist/${projectId}`);
        updateUser({
          watchlist: user.watchlist.filter(id => id !== projectId)
        });
      } else {
        const { data } = await api.post(`/users/watchlist/${projectId}`);
        updateUser({ watchlist: data.watchlist });
      }
    } catch (error: any) {
      const message = handleApiError(error);
      console.error('Error updating watchlist:', message);
      throw new Error(message);
    }
  };

  const connectToProject = async (projectId: string): Promise<void> => {
    if (!user) {
      throw new Error('Must be logged in');
    }

    try {
      const { data } = await api.post('/investments', {
        project: projectId,
        amount: 0 // Amount will be determined in chat
      });
      
      updateUser({
        portfolio: [...(user.portfolio || []), data.investment._id]
      });
    } catch (error: any) {
      const message = handleApiError(error);
      console.error('Error connecting to project:', message);
      throw new Error(message);
    }
  };

  return {
    toggleWatchlist,
    connectToProject
  };
}