import React, { useState, useEffect } from 'react';
import { apiService, ContextFile, GenerateRequest } from './services/apiService';
import ContextFileUpload from './components/ContextFileUpload';
import ContextFileList from './components/ContextFileList';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [selectedContextFiles, setSelectedContextFiles] = useState<string[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);

  // Fetch context files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await apiService.listContextFiles();
        if (response.success) {
          setContextFiles(response.data);
        }
      } catch (err) {
        console.error('Error fetching context files:', err);
      }
    };
    fetchFiles();
  }, []);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: GenerateRequest = {
        prompt,
        contextFiles: selectedContextFiles,
      };
      const response = await apiService.generateContent(request);
      setGeneratedContent(response.data.content);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUploaded = (file: ContextFile) => {
    setContextFiles([...contextFiles, file]);
    setShowFileUpload(false); // Hide upload form after success
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await apiService.deleteContextFile(fileId);
      setContextFiles(contextFiles.filter((f) => f.id !== fileId));
      setSelectedContextFiles(selectedContextFiles.filter((id) => id !== fileId));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete file');
    }
  };

  const handleContextSelection = (fileId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedContextFiles([...selectedContextFiles, fileId]);
    } else {
      setSelectedContextFiles(selectedContextFiles.filter((id) => id !== fileId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto py-4 px-5">
          <h1 className="text-3xl font-bold text-gray-900">AI Content Generator</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-5">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg
                onClick={() => setError(null)}
                className="fill-current h-6 w-6 text-red-500 cursor-pointer"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-3">Context Management</h2>
          <div className="mb-4">
            <button
              onClick={() => setShowFileUpload(!showFileUpload)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {showFileUpload ? 'Cancel Upload' : 'Upload New Context File'}
            </button>
          </div>

          {showFileUpload && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <ContextFileUpload
                onFileUploaded={handleFileUploaded}
                onError={(err) => setError(err)}
              />
            </div>
          )}

          <ContextFileList
            files={contextFiles}
            onDelete={handleDeleteFile}
            selectedFiles={selectedContextFiles}
            onSelectionChange={handleContextSelection}
            isDeleting={setIsDeleting}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Prompt</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || isDeleting}
            className={`
              w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors
              ${isLoading || isDeleting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : 'Generate Content'}
          </button>
        </div>

        {generatedContent && (
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-3">Generated Content</h2>
            <div className="prose max-w-none p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
              {generatedContent}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
