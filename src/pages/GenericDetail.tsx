import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import ProjectDetail from '@/pages/ProjectDetail';
import ClientDetail from '@/pages/ClientDetail';
import NotFound from '@/pages/NotFound';
import { Loader2 } from 'lucide-react';

const GenericDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Try to fetch as project
  const { data: project, isLoading: projectLoading, error: projectError } = useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      try {
        return await api.get(`/api/projects/${slug}`);
      } catch (err: any) {
        if (err.response?.status === 404 || (err.message && err.message.includes('404'))) {
            throw err;
        }
        return null;
      }
    },
    retry: false,
    enabled: !!slug,
  });

  // Try to fetch as client if project fails
  const { data: client, isLoading: clientLoading } = useQuery({
    queryKey: ['client-detail', slug],
    queryFn: async () => {
      try {
        return await api.get(`/api/clients/${slug}`);
      } catch (err: any) {
         if (err.response?.status === 404 || (err.message && err.message.includes('404'))) {
            throw err;
        }
        return null;
      }
    },
    retry: false,
    enabled: !!slug && !!projectError,
  });

  if (projectLoading) {
     return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
     );
  }

  if (project) {
    return <ProjectDetail />;
  }

  if (clientLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
     );
  }

  if (client) {
    return <ClientDetail />;
  }

  return <NotFound />;
};

export default GenericDetail;
