import axios from 'axios';
import {
  ApiResponse,
  Project,
  CreateProjectRequest,
  Chat,
  CreateChatRequest,
  Message,
  ContextFile,
  UploadContextFileRequest,
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export interface GenerateRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  contextFiles?: string[];
}

export interface GenerateResponse {
  success: boolean;
  data: {
    response: {
      content: string;
      usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
      };
      provider: string;
      model: string;
    };
    messageId: string;
  };
}

export interface UploadContextResponse {
  success: boolean;
  data: {
    message: string;
    contextInfo: ContextFile;
  };
}

export const apiService = {
  // Generate AI content
  generateContent: async (
    request: GenerateRequest
  ): Promise<GenerateResponse> => {
    const response = await apiClient.post('/generate', request);
    return response.data;
  },

  // Upload context file
  uploadContextFile: async (
    request: UploadContextFileRequest
  ): Promise<ApiResponse<ContextFile>> => {
    const formData = new FormData();
    formData.append('contextFile', request.file);
    formData.append('projectId', request.projectId);
    if (request.contextName) {
      formData.append('contextName', request.contextName);
    }

    const response = await apiClient.post('/context-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // List context files by project
  listContextFilesByProject: async (
    projectId: string
  ): Promise<ApiResponse<ContextFile[]>> => {
    const response = await apiClient.get(
      `/projects/${projectId}/context-files`
    );
    return response.data;
  },

  // Delete context file
  deleteContextFile: async (fileId: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/context-files/${fileId}`);
    return response.data;
  },

  // Projects
  createProject: async (
    request: CreateProjectRequest
  ): Promise<ApiResponse<Project>> => {
    const response = await apiClient.post('/projects', request);
    return response.data;
  },

  listProjects: async (): Promise<ApiResponse<Project[]>> => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  // Chats
  createChat: async (
    request: CreateChatRequest
  ): Promise<ApiResponse<Chat>> => {
    const response = await apiClient.post('/chats', request);
    return response.data;
  },

  listChatsByProject: async (
    projectId: string
  ): Promise<ApiResponse<Chat[]>> => {
    const response = await apiClient.get(`/projects/${projectId}/chats`);
    return response.data;
  },

  getChatById: async (chatId: string): Promise<ApiResponse<Chat>> => {
    const response = await apiClient.get(`/chats/${chatId}`);
    return response.data;
  },

  // Messages
  sendMessage: async (
    chatId: string,
    message: string,
    maxTokens?: number,
    temperature?: number
  ): Promise<GenerateResponse> => {
    const response = await apiClient.post('/generate', {
      prompt: message,
      chatId,
      maxTokens,
      temperature,
    });
    return response.data;
  },

  listMessagesByChat: async (
    chatId: string
  ): Promise<ApiResponse<Message[]>> => {
    const response = await apiClient.get(`/chats/${chatId}/messages`);
    return response.data;
  },
};
