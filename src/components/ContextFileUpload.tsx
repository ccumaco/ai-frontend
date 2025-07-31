import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { apiService, ContextFile } from '../services/apiService';

interface ContextFileUploadProps {
  onFileUploaded: (file: ContextFile) => void;
  onError: (error: string) => void;
}

const ContextFileUpload: React.FC<ContextFileUploadProps> = ({ onFileUploaded, onError }) => {
  const [uploading, setUploading] = useState(false);
  const [contextName, setContextName] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      const response = await apiService.uploadContextFile(file, contextName || undefined);
      onFileUploaded(response.data.contextInfo);
      setContextName('');
    } catch (error: any) {
      onError(error.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  }, [contextName, onFileUploaded, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md', '.json'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="contextName" className="block text-sm font-medium text-gray-700 mb-1">
          Context Name (Optional)
        </label>
        <input
          type="text"
          id="contextName"
          value={contextName}
          onChange={(e) => setContextName(e.target.value)}
          placeholder="Enter a name for this context"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={uploading}
        />
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-2"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isDragActive ? (
              <p className="text-blue-600">Drop the file here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-1">
                  Drag & drop a context file here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports: .txt, .md, .json files
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextFileUpload;
