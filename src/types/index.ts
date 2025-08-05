// Project types
export interface Project {
  _id: string;
  name: string;
  description?: string;
  contextInstructions?: string;
  contextFiles: string[];
  aiProvider?: string;
  aiSettings?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  contextInstructions?: string;
  aiProvider?: string;
  aiSettings?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
}

// Chat types
export interface Chat {
  _id: string;
  projectId: string;
  name: string;
  description?: string;
  contextInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatRequest {
  projectId: string;
  name: string;
  description?: string;
  contextInstructions?: string;
}

// Message types
export interface Message {
  _id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    provider?: string;
    model?: string;
    contextFiles?: string[];
  };
  createdAt: string;
}

export interface SendMessageRequest {
  prompt: string;
  chatId: string;
  maxTokens?: number;
  temperature?: number;
}

// Context File types
export interface ContextFile {
  _id: string;
  projectId: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  filePath: string;
  contextName: string;
  createdAt: string;
}

export interface UploadContextFileRequest {
  projectId: string;
  file: File;
  contextName?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface GenerateResponse {
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
}

// UI State types
export interface AppState {
  currentProject: Project | null;
  currentChat: Chat | null;
  projects: Project[];
  chats: Chat[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface SidebarState {
  isCollapsed: boolean;
  activeSection: 'projects' | 'chats';
}
