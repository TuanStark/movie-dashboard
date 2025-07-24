import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';

interface ReviewHeaderProps {
  onAddReview: () => void;
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({ onAddReview }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="text-blue-500" />
          Quản lý đánh giá
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quản lý đánh giá và nhận xét của người dùng về phim
        </p>
      </div>
      <button
        onClick={onAddReview}
        className="btn btn-primary flex items-center gap-2"
        title="Thêm đánh giá mới"
      >
        <Plus size={20} />
        Thêm đánh giá
      </button>
    </div>
  );
};

export default ReviewHeader;
