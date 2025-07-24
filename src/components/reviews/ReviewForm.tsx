import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare, User, Film } from 'lucide-react';
import type { Review, Movie, Users } from '../../types/global-types';
import ServiceApi from '../../services/api';

interface ReviewFormProps {
  review?: Review | null;
  onSubmit: (review: Omit<Review, 'id' | 'user' | 'movie'>) => Promise<void>;
  onCancel: () => void;
}

const emptyReview: Omit<Review, 'id' | 'user' | 'movie'> = {
  userId: 0,
  movieId: 0,
  rating: 5,
  comment: '',
  status: 'pending'
};

const ReviewForm: React.FC<ReviewFormProps> = ({ review, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Review, 'id' | 'user' | 'movie'>>(review || emptyReview);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMovies();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (review) {
      setFormData({
        userId: review.userId,
        movieId: review.movieId,
        rating: review.rating,
        comment: review.comment,
        status: review.status
      });
    }
  }, [review]);

  const fetchMovies = async () => {
    try {
      const response = await ServiceApi.get('/movies');
      setMovies(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await ServiceApi.get('/users');
      setUsers(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userId) {
      newErrors.userId = 'Vui lòng chọn người dùng';
    }
    if (!formData.movieId) {
      newErrors.movieId = 'Vui lòng chọn phim';
    }
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Đánh giá phải từ 1 đến 5 sao';
    }
    if (!formData.comment.trim()) {
      newErrors.comment = 'Vui lòng nhập nhận xét';
    }
    if (!formData.status) {
      newErrors.status = 'Vui lòng chọn trạng thái';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStars = (rating: number, onStarClick: (star: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onStarClick(i + 1)}
        className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
      >
        <Star size={24} className={i < rating ? 'fill-current' : ''} />
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="text-blue-500" />
            {review ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="inline mr-2" size={16} />
                Người dùng
              </label>
              <select
                value={formData.userId}
                onChange={(e) => handleChange('userId', parseInt(e.target.value))}
                className={`input ${errors.userId ? 'border-red-500' : ''}`}
                required
              >
                <option value={0}>Chọn người dùng</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="text-red-500 text-sm mt-1">{errors.userId}</p>
              )}
            </div>

            {/* Movie Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Film className="inline mr-2" size={16} />
                Phim
              </label>
              <select
                value={formData.movieId}
                onChange={(e) => handleChange('movieId', parseInt(e.target.value))}
                className={`input ${errors.movieId ? 'border-red-500' : ''}`}
                required
              >
                <option value={0}>Chọn phim</option>
                {movies.map(movie => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
              {errors.movieId && (
                <p className="text-red-500 text-sm mt-1">{errors.movieId}</p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Đánh giá
            </label>
            <div className="flex items-center gap-2">
              {renderStars(formData.rating, (rating) => handleChange('rating', rating))}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {formData.rating}/5 sao
              </span>
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nhận xét
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleChange('comment', e.target.value)}
              className={`input min-h-[120px] ${errors.comment ? 'border-red-500' : ''}`}
              placeholder="Nhập nhận xét về phim..."
              required
            />
            {errors.comment && (
              <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={`input ${errors.status ? 'border-red-500' : ''}`}
              required
            >
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>

          {/* Preview */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Xem trước:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                  />
                ))}
                <span className="text-sm font-medium">{formData.rating}/5</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formData.comment || 'Chưa có nhận xét...'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn btn-outline"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </div>
              ) : (
                review ? 'Cập nhật' : 'Thêm đánh giá'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
