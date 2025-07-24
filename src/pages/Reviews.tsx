import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, Star, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewDetail from '../components/reviews/ReviewDetail';
import DeleteConfirmation from '../components/DeleteConfirmation';
import ServiceApi from '../services/api';
import type { Review, Meta } from '../types/global-types';
import useQuery from '../hooks/useQuery';
import Pagination from '../components/pagination';
import { formatDateTime } from '../types/format-datetime';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  

  const [query, updateQuery] = useQuery({
    page: 1,
    limit: 10,
    search: '',
    status: 'all',
    rating: 'all',
    sort: 'id',
    order: 'desc'
  });

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: query.page,
        limit: query.limit,
        search: query.search,
        sort: query.sort,
        order: query.order,
      };

      if (query.status !== 'all') {
        params.status = query.status;
      }
      if (query.rating !== 'all') {
        params.rating = query.rating;
      }

      const response = await ServiceApi.get('/movie-review', { params });
      setReviews(response.data.data.data || []);
      setMeta(response.data.data.meta);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [query]);

  const handleAdd = () => {
    setSelectedReview(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (review: Review) => {
    setSelectedReview(review);
    setShowDeleteConfirm(true);
  };

  const handleView = (review: Review) => {
    setSelectedReview(review);
    setShowDetail(true);
  };

  const handleSubmit = async (reviewData: Omit<Review, 'id' | 'user' | 'movie'>) => {
    try {
      if (isEditing && selectedReview) {
        await ServiceApi.patch(`/movie-review/${selectedReview.id}`, reviewData);
      } else {
        await ServiceApi.post('/movie-review', reviewData);
      }
      await fetchReviews();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  const confirmDelete = async () => {
    if (selectedReview) {
      try {
        await ServiceApi.delete(`/movie-review/${selectedReview.id}`);
        await fetchReviews();
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleStatusChange = async (review: Review, newStatus: string) => {
    try {
      await ServiceApi.patch(`/movie-review/${review.id}`, { status: newStatus });
      await fetchReviews();
    } catch (error) {
      console.error('Error updating review status:', error);
    }
  };

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="p-6">
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
          onClick={handleAdd}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm đánh giá
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm đánh giá..."
              value={query.search}
              onChange={(e) => updateQuery({ search: e.target.value, page: 1 })}
              className="input pl-10"
            />
          </div>

          <select
            value={query.status}
            onChange={(e) => updateQuery({ status: e.target.value, page: 1 })}
            className="input"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>

          <select
            value={query.rating}
            onChange={(e) => updateQuery({ rating: e.target.value, page: 1 })}
            className="input"
          >
            <option value="all">Tất cả đánh giá</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>

          <select
            value={`${query.sort}-${query.order}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              updateQuery({ sort, order, page: 1 });
            }}
            className="input"
          >
            <option value="id-desc">Mới nhất</option>
            <option value="id-asc">Cũ nhất</option>
            <option value="rating-desc">Đánh giá cao nhất</option>
            <option value="rating-asc">Đánh giá thấp nhất</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Phim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nhận xét
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Không có đánh giá nào được tìm thấy
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            src={review.user.avatar || '/default-avatar.png'}
                            alt={`${review.user.firstName} ${review.user.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {review.user.firstName} {review.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {review.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={review.movie.posterPath}
                          alt={review.movie.title}
                          className="w-10 h-14 object-cover rounded"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {review.movie.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                          {review.rating}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {review.comment}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                          {getStatusIcon(review.status)}
                          <span className="ml-1">
                            {review.status === 'approved' ? 'Đã duyệt' : 
                             review.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {review.createdAt ? formatDateTime(review.createdAt) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(review)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Xem
                        </button>
                        {review.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(review, 'approved')}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleStatusChange(review, 'rejected')}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleEdit(review)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(review)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              page={meta.pageNumber}
              total={meta.total}
              limit={meta.limitNumber}
              setPage={(page: React.SetStateAction<number>) => {
                const newPage = typeof page === 'function' ? page(meta.pageNumber) : page;
                updateQuery({ page: newPage });
              }}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <ReviewForm
          review={selectedReview}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showDetail && selectedReview && (
        <ReviewDetail
          review={selectedReview}
          onClose={() => setShowDetail(false)}
          onEdit={() => {
            setShowDetail(false);
            handleEdit(selectedReview);
          }}
          onDelete={() => {
            setShowDetail(false);
            handleDelete(selectedReview);
          }}
          onStatusChange={(status) => {
            handleStatusChange(selectedReview, status);
            setShowDetail(false);
          }}
        />
      )}

      {showDeleteConfirm && selectedReview && (
        <DeleteConfirmation
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title="Xóa đánh giá"
          message={`Bạn có chắc chắn muốn xóa đánh giá này?`}
        />
      )}
    </div>
  );
};

export default Reviews;
