import React from 'react';
import SidebarNew from '../components/SidebarNew';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import {
  fetchProjects,
  selectProjectsLoading,
  selectProjectsError,
} from '../features/projects/projectsSlice';
import { useEffect } from 'react';
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loading = useSelector(selectProjectsLoading);
  const errorAPI = useSelector(selectProjectsError);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className='h-screen flex'>
      {/* Sidebar */}
      <SidebarNew />
      {loading ? (
        <div className='flex-1 flex items-center justify-center'>
          <p>Loading projects...</p>
        </div>
      ) : errorAPI ? (
        <div className='flex-1 flex items-center justify-center'>
          <p className='text-red-500'>Error: {errorAPI}</p>
        </div>
      ) : null}
      <div className='flex-1 p-8 bg-white'>{children}</div>
    </div>
  );
};

export default MainLayout;
