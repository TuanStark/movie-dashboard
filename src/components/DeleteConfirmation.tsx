import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  title,
  message,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-error-50 dark:bg-error-500/20 rounded-full">
            <AlertTriangle size={24} className="text-error-500" />
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-error-500 hover:bg-error-600 text-white"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation; 