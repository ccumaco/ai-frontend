'use client';

import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiChartPie, HiShoppingBag } from 'react-icons/hi';
import { Chat, Project, SidebarState } from '../types';
import { apiService } from '../services/apiService';
import { Link } from 'react-router-dom';

export function SidebarNew() {
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
  return (
    <Sidebar
      className='h-full'
      aria-label='Sidebar with multi-level dropdown example'
    >
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href='/' icon={HiChartPie}>
            Home
          </SidebarItem>
          <SidebarCollapse icon={HiShoppingBag} label='Proyectos'>
            {projects.map((project) => (
              <SidebarItem
                key={project._id}
                className='mb-1 bg-blue-600
                 *:**:'
                href={`/projects/${project._id}`}
              >
                {project.name}
              </SidebarItem>
            ))}
          </SidebarCollapse>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}

export default SidebarNew;
