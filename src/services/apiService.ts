import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

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
    content: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    provider: string;
    model: string;
  };
}

export interface ContextFile {
  id: string;
  filename: string;
  originalname: string;
  contextName: string;
  mimetype: string;
  size: number;
  filePath: string;
  createdAt: string;
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
    file: File,
    contextName?: string
  ): Promise<UploadContextResponse> => {
    const formData = new FormData();
    formData.append('contextFile', file);
    if (contextName) {
      formData.append('contextName', contextName);
    }

    const response = await apiClient.post('/upload-context', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // List context files (you'll need to implement this endpoint in the backend)
  listContextFiles: async (): Promise<{
    success: boolean;
    data: ContextFile[];
  }> => {
    try {
      const response = await apiClient.get('/context-files');
      return response.data;
    } catch (error) {
      // Fallback if endpoint doesn't exist yet
      return { success: true, data: [] };
    }
  },

  // Delete context file (you'll need to implement this endpoint in the backend)
  deleteContextFile: async (fileId: string): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.delete(`/context-files/${fileId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
