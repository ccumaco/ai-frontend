import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Project } from '../types';
import { useNavigate } from 'react-router-dom';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await apiService.listProjects();
      if (response.success) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName) {
      setError('Project name is required.');
      return;
    }

    setError(null);

    try {
      const response = await apiService.createProject({ name: newProjectName });
      if (response.success) {
        setProjects([...projects, response.data]);
        setNewProjectName('');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to create project');
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-4'>Projects</h1>

      {error && <div className='text-red-600 mb-4'>{error}</div>}

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
  );
};

export default Projects;
