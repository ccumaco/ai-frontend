import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Project, Chat, SidebarState } from '../types';
import clsx from 'clsx';
import { Button } from 'flowbite-react';

const Sidebar: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    isCollapsed: false,
    activeSection: 'projects',
  });

  useEffect(() => {
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
    fetchProjects();
  }, []);

  const handleSectionChange = (section: 'projects' | 'chats') => {
    setSidebarState((prevState) => ({
      ...prevState,
      activeSection: section,
    }));

    if (section === 'chats' && projects.length > 0) {
      const activeProjectId = projects[0]._id;
      apiService.listChatsByProject(activeProjectId).then((response) => {
        if (response.success) {
          setChats(response.data);
        }
      });
    }
  };

  const renderProjects = () => (
    <ul className='mt-2'>
      {projects.map((project) => (
        <li key={project._id} className='mb-1'>
          <Link
            to={`/projects/${project._id}`}
            className='block py-2 px-3 rounded hover:bg-gray-200'
          >
            {project.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderChats = () => (
    <ul className='mt-2'>
      {chats.map((chat) => (
        <li key={chat._id} className='mb-1'>
          <Link
            to={`/chats/${chat._id}`}
            className='block py-2 px-3 rounded hover:bg-gray-200'
          >
            {chat.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={clsx(
        'bg-gray-100 h-full p-3 shadow-md',
        sidebarState.isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className='mb-4'>
        <Button
          //redirect to home page
          onClick={() => (window.location.href = '/')}
        >
          Home
        </Button>
        <button
          onClick={() => handleSectionChange('projects')}
          className={clsx(
            'w-full py-2 ',
            sidebarState.activeSection === 'projects' && 'bg-blue-200'
          )}
        >
          Projects
        </button>
        <button
          onClick={() => handleSectionChange('chats')}
          className={clsx(
            'w-full py-2 mt-1',
            sidebarState.activeSection === 'chats' && 'bg-blue-200'
          )}
        >
          Chats
        </button>
      </div>

      {sidebarState.activeSection === 'projects'
        ? renderProjects()
        : renderChats()}
    </div>
  );
};

export default Sidebar;
