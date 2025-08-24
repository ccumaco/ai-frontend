import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Project, ContextFile, Chat } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../Layout/main';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [newChatName, setNewChatName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await apiService.listChatsByProject(projectId!);
      if (response.success) {
        setChats(response.data);
      }
      const contextResponse = await apiService.listContextFilesByProject(
        projectId!
      );
      if (contextResponse.success) {
        setContextFiles(contextResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch project details:', error);
    }
  };

  const handleCreateChat = async () => {
    if (!newChatName) {
      setError('Chat name is required.');
      return;
    }

    try {
      const response = await apiService.createChat({
        projectId: projectId!,
        name: newChatName,
      });
      if (response.success) {
        setChats([...chats, response.data]);
        setNewChatName('');
      }
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error
        ) {
          setError(
            (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error || 'Failed to create chat'
          );
        } else {
          setError('Failed to create chat');
        }
      } else {
        setError('Failed to create chat');
      }
    }
  };

  return (
    <MainLayout>
      <h1 className='text-3xl font-bold mb-4'>
        {project?.name || 'Project Details'}
      </h1>

      {error && <div className='text-red-600 mb-4'>{error}</div>}

      <h2 className='text-xl font-semibold mb-2'>Context Files</h2>
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
