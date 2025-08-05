import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Message, Chat, Project } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Loader, RefreshCw } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      fetchChatData();
      fetchMessages();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatData = async () => {
    try {
      // This would be implemented in the backend
      const chatResponse = await apiService.getChatById(chatId!);
      if (chatResponse.success) {
        setChat(chatResponse.data);
        // const projectResponse = await apiService.getProjectById(chatResponse.data.projectId);
        // if (projectResponse.success) {
        //   setProject(projectResponse.data);
        // }
      }
    } catch (error) {
      console.error('Failed to fetch chat data:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await apiService.listMessagesByChat(chatId!);
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageContent = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.sendMessage(chatId!, messageContent);

      if (response.success) {
        // The backend automatically saves both user and assistant messages
        // We need to refresh the message list to show them
        await fetchMessages();
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to send message');
      setInputMessage(messageContent); // Restore the message if it failed
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!chatId) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-gray-500'>Select a chat to start conversation</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full bg-white'>
      {/* Chat Header */}
      <div className='bg-gray-50 border-b px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-semibold text-gray-900'>
              {chat?.name || 'Chat'}
            </h1>
            {project && (
              <p className='text-sm text-gray-500'>Project: {project.name}</p>
            )}
          </div>
          <div className='flex items-center space-x-2'>
            <button
              onClick={fetchMessages}
              className='p-2 text-gray-400 hover:text-gray-600 transition-colors'
              title='Refresh messages'
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto px-6 py-4 space-y-4'>
        {messages.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            <p className='text-gray-500'>
              No messages yet. Start a conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-3xl rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className='prose prose-sm max-w-none'>
                  {message.role === 'user' ? (
                    <p className='whitespace-pre-wrap'>{message.content}</p>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTimestamp(message.createdAt)}
                  {message.metadata?.provider && (
                    <span className='ml-2'>• {message.metadata.provider}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className='flex justify-start'>
            <div className='bg-gray-100 rounded-lg px-4 py-2'>
              <div className='flex items-center space-x-2'>
                <Loader className='animate-spin' size={16} />
                <span className='text-gray-600'>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className='mx-6 mb-4 p-3 bg-red-100 border border-red-300 rounded-lg'>
          <p className='text-red-700 text-sm'>{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className='border-t bg-gray-50 px-6 py-4'>
        <div className='flex items-end space-x-3'>
          <div className='flex-1'>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Type your message...'
              className='w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              rows={3}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className='bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg p-3 transition-colors'
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
