import React from 'react';
import { Search } from 'lucide-react';

interface ReviewFiltersProps {
  query: {
    search: string;
    status: string;
    rating: string;
    sort: string;
    order: string;
  };
  onQueryUpdate: (updates: Partial<typeof query>) => void;
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  query,
  onQueryUpdate
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm đánh giá..."
            value={query.search}
            onChange={(e) => onQueryUpdate({ search: e.target.value, page: 1 })}
            className="input pl-10"
          />
        </div>

        {/* Status Filter */}
        <select
          value={query.status}
          onChange={(e) => onQueryUpdate({ status: e.target.value, page: 1 })}
          className="input"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>

        {/* Rating Filter */}
        <select
          value={query.rating}
          onChange={(e) => onQueryUpdate({ rating: e.target.value, page: 1 })}
          className="input"
        >
          <option value="all">Tất cả đánh giá</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>

        {/* Sort Options */}
        <select
          value={`${query.sort}-${query.order}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split('-');
            onQueryUpdate({ sort, order, page: 1 });
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
  );
};

export default ReviewFilters;
