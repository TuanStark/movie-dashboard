import React from 'react';
import { X, Edit, Trash, Star, MessageSquare, User, Film, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Review } from '../../types/global-types';
import { formatDateTime } from '../../types/format-datetime';

interface ReviewDetailProps {
  review: Review;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ 
  review, 
  onClose, 
  onEdit, 
  onDelete, 
  onStatusChange 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      default:
        return 'Chờ duyệt';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="text-blue-500" />
            Chi tiết đánh giá
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Review Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Rating and Comment */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {review.rating}/5
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(review.status)}`}>
                    {getStatusIcon(review.status)}
                    <span className="ml-1">{getStatusText(review.status)}</span>
                  </span>
                </div>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>

              {/* Movie Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Film className="text-blue-500" size={20} />
                  Thông tin phim
                </h3>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-start gap-4">
                    <img
                      src={review.movie.posterPath}
                      alt={review.movie.title}
                      className="w-20 h-28 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                        {review.movie.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {review.movie.synopsis.substring(0, 200)}...
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-500 mr-1" fill="#FFD700" />
                          <span>{review.movie.rating}/10</span>
                        </div>
                        <span>{review.movie.duration}</span>
                        <span>{review.movie.releaseDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="text-blue-500" size={20} />
                  Thông tin người dùng
                </h3>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-4">
                    <img
                      src={review.user.avatar || '/default-avatar.png'}
                      alt={`${review.user.firstName} ${review.user.lastName}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {review.user.firstName} {review.user.lastName}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {review.user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          review.user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                        }`}>
                          {review.user.role}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          review.user.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {review.user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              {review.status === 'pending' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Thao tác nhanh
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => onStatusChange('approved')}
                      className="w-full btn btn-success flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Duyệt đánh giá
                    </button>
                    <button
                      onClick={() => onStatusChange('rejected')}
                      className="w-full btn btn-danger flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} />
                      Từ chối đánh giá
                    </button>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Thời gian
                </h3>
                <div className="space-y-3">
                  {review.createdAt && (
                    <div className="flex items-center text-sm">
                      <Calendar className="text-gray-400 mr-2" size={16} />
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Tạo:</div>
                        <div className="font-medium">{formatDateTime(review.createdAt)}</div>
                      </div>
                    </div>
                  )}
                  {review.updatedAt && (
                    <div className="flex items-center text-sm">
                      <Calendar className="text-gray-400 mr-2" size={16} />
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Cập nhật:</div>
                        <div className="font-medium">{formatDateTime(review.updatedAt)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Stats */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Thống kê
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">ID:</span>
                    <span className="font-medium">#{review.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Đánh giá:</span>
                    <span className="font-medium">{review.rating}/5 ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Độ dài:</span>
                    <span className="font-medium">{review.comment.length} ký tự</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            onClick={onClose}
            className="btn btn-outline"
          >
            Đóng
          </button>
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="btn btn-primary flex items-center gap-2"
            >
              <Edit size={16} />
              Chỉnh sửa
            </button>
            <button
              onClick={onDelete}
              className="btn btn-danger flex items-center gap-2"
            >
              <Trash size={16} />
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
