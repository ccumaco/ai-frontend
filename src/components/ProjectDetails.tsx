import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Project, ContextFile, Chat } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../Layout/main';
import { useSelector } from 'react-redux';
import { selectProjects } from '../features/projects/projectsSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import {
  createChat,
  fetchChatsByProject,
  selectChats,
} from '../features/chats/chatsSlice';
const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const navigate = useNavigate();
  const [newChatName, setNewChatName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const projects = useSelector(selectProjects);
  const [project, setProject] = useState<Project | null>(null);
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);

  //get listChatsByProject
  const dispatch = useDispatch<AppDispatch>();
  const chats = useSelector(selectChats);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchChatsByProject(projectId));
    }
  }, [dispatch, projectId]);

  //get context files
  useEffect(() => {
    const fetchContextFiles = async () => {
      if (!projectId) return;
      try {
        const response = await apiService.listContextFilesByProject(projectId);
        if (response.success) {
          setContextFiles(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch context files', error);
        setError('Failed to fetch context files');
      }
    };
    fetchContextFiles();
  }, [projectId]);

  //set project when projects or projectId changes
  useEffect(() => {
    if (projects.length > 0 && projectId) {
      const foundProject = projects.find((p) => p._id === projectId);
      setProject(foundProject || null);
      console.log(foundProject, 'foundProject');
    }
  }, [projects, projectId]);

  //pending get chats
  const handleCreateChat = () => {
    if (!newChatName.trim()) return;
    dispatch(createChat({ projectId: '', name: newChatName }));
    setNewChatName('');
  };

  return (
    <MainLayout>
      <h1 className='text-3xl font-bold mb-4'>
        {project?.name || 'Project Details'}
      </h1>

      {error && <div className='text-red-600 mb-4'>{error}</div>}

      <h2 className='text-xl font-semibold mb-2'>Context Files</h2>

      {/* Drag and drop to upload context */}

      <ul className='list-disc ml-5 mb-4'>
        {contextFiles.map((file) => (
          <li key={file._id}>
            <div className='p-2 border rounded'>{file.contextName}</div>
          </li>
        ))}
      </ul>

      <h2 className='text-xl font-semibold mb-2'>Chats</h2>
      <input
        type='text'
        placeholder='New Chat Name'
        value={newChatName}
        onChange={(e) => setNewChatName(e.target.value)}
        className='border rounded px-3 py-2 mr-2'
      />
      <button
        onClick={handleCreateChat}
        className='bg-blue-500 text-white px-4 py-2 rounded'
      >
        Create Chat
      </button>

      <ul className='list-disc ml-5 mt-4'>
        {chats.map((chat) => (
          <li key={chat._id} className='mb-2'>
            <div
              className='p-2 border rounded hover:bg-gray-100 cursor-pointer'
              onClick={() => navigate(`/chats/${chat._id}`)}
            >
              {chat.name}
            </div>
          </li>
        ))}
      </ul>
    </MainLayout>
  );
};

export default ProjectDetails;
