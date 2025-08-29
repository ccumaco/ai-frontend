import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../Layout/main';
import { useSelector } from 'react-redux';
import {
  createProject,
  selectProjects,
  selectProjectsError,
  selectProjectsLoading,
} from '../features/projects/projectsSlice';
import { AppDispatch } from '../store';
import { useDispatch } from 'react-redux';

const Projects: React.FC = () => {
  const [newProjectName, setNewProjectName] = useState('');
  const navigate = useNavigate();
  const projects = useSelector(selectProjects);
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectProjectsLoading);
  const error = useSelector(selectProjectsError);
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    dispatch(createProject({ name: newProjectName }));
    setNewProjectName('');
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <MainLayout>
      <div>
        <h1 className='text-3xl font-bold mb-4'>Projects</h1>

        {error && <div className='text-red-600 mb-4'>{error}</div>}
        {loading && <div className='mb-4'>Loading...</div>}
        <div className='mb-4'>
          <input
            type='text'
            placeholder='New Project Name'
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className='border rounded px-3 py-2 mr-2'
          />
          <button
            onClick={handleCreateProject}
            className='bg-blue-500 text-white px-4 py-2 rounded'
          >
            Create Project
          </button>
        </div>

        <ul className='list-disc ml-5'>
          {projects.map((project) => (
            <li
              key={project._id}
              className='mb-2 cursor-pointer'
              onClick={() => handleProjectClick(project._id)}
            >
              <div className='p-2 border rounded hover:bg-gray-100'>
                {project.name}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
};

export default Projects;
