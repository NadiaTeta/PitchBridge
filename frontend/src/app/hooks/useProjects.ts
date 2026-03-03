import { useState, useEffect } from 'react';
import api from '../services/api';

interface Project {
  _id: string;
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  fundingGoal: number;
  raised: number;
  roi: string;
  image: string;
  entrepreneur: any;
  status: string;
  verified: {
    nid: boolean;
    rdb: boolean;
  };
}

interface UseProjectsFilters {
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
  status?: string;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  createProject: (projectData: any) => Promise<Project>;
  updateProject: (id: string, updates: any) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

// Added 'mine' parameter with a default value of false
export function useProjects(filters: UseProjectsFilters = {}, mine: boolean = false): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [JSON.stringify(filters), mine]); // Added mine to dependency array

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.location) {
        params.append('location', filters.location);
      }
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      
      // Now 'mine' is defined because it's an argument of the hook
      const url = mine ? '/projects/my/projects' : '/projects';
      
      const { data } = await api.get(`${url}?${params.toString()}`);
      
      // Map _id to id for consistency with frontend
      const mappedProjects = data.projects.map((p: any) => ({
        ...p,
        id: p._id || p.id
      }));
      
      setProjects(mappedProjects);
      setError(null);
    } catch (err: any) {
      setError(err.error || 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: any): Promise<Project> => {
    try {
      const { data } = await api.post('/projects', projectData);
      const newProject = { ...data.project, id: data.project._id || data.project.id };
      setProjects([newProject, ...projects]);
      return newProject;
    } catch (err: any) {
      throw new Error(err.error || 'Failed to create project');
    }
  };

  const updateProject = async (id: string, updates: any): Promise<Project> => {
    try {
      const { data } = await api.put(`/projects/${id}`, updates);
      const updatedProject = { ...data.project, id: data.project._id || data.project.id };
      setProjects(projects.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (err: any) {
      throw new Error(err.error || 'Failed to update project');
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      throw new Error(err.error || 'Failed to delete project');
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  };
}