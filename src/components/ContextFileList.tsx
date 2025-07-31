import React from 'react';
import { ContextFile } from '../services/apiService';

interface ContextFileListProps {
  files: ContextFile[];
  onDelete: (fileId: string) => void;
  selectedFiles: string[];
  onSelectionChange: (fileId: string, isSelected: boolean) => void;
  isDeleting: (deleting: boolean) => void;
}

const ContextFileList: React.FC<ContextFileListProps> = ({
  files,
  onDelete,
  selectedFiles,
  onSelectionChange,
  isDeleting,
}) => {
  const handleDelete = async (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this context file?')) {
      isDeleting(true);
      await onDelete(fileId);
      isDeleting(false);
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto bg-gray'>
      <h2 className='text-xl font-semibold mb-3'>Available Context Files</h2>
      {files.length === 0 ? (
        <p className='text-gray-500 italic'>No context files uploaded yet.</p>
      ) : (
        <ul className='space-y-3'>
          {files.map((file) => (
            <li
              key={file.id}
              className='flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm'
            >
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  checked={selectedFiles.includes(file.id)}
                  onChange={(e) => onSelectionChange(file.id, e.target.checked)}
                  className='h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-4'
                />
                <div>
                  <p className='font-medium text-gray-800'>
                    {file.contextName}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {file.originalname} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(file.id)}
                className='text-red-500 hover:text-red-700 font-medium py-1 px-3 rounded-md transition-colors'
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContextFileList;
