'use client';

import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from 'flowbite-react';
import { HiChartPie, HiShoppingBag } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { selectProjects } from '../features/projects/projectsSlice';
import { useLocation, useNavigate } from 'react-router-dom';
export function SidebarNew() {
  //dummy projects data

  const projects = useSelector(selectProjects);
  const navigate = useNavigate();
  return (
    <Sidebar
      className='h-full'
      aria-label='Sidebar with multi-level dropdown example'
    >
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem onClick={() => navigate('/')} icon={HiChartPie}>
            Home
          </SidebarItem>
          <SidebarCollapse open active icon={HiShoppingBag} label='Proyectos'>
            {projects.map((project) => (
              <SidebarItem
                key={project._id}
                className={`cursor-pointer ${
                  window.location.pathname === `/projects/${project._id}`
                    ? 'bg-blue-500 text-white'
                    : ''
                }`}
                id={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
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
