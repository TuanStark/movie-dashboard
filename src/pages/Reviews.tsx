import React, { useState, useEffect } from 'react';
import ReviewHeader from '../components/reviews/ReviewHeader';
import ReviewFilters from '../components/reviews/ReviewFilters';
import ReviewTable from '../components/reviews/ReviewTable';
import ReviewModals from '../components/reviews/ReviewModals';
import ServiceApi from '../services/api';
import type { Review, Meta } from '../types/global-types';
import useQuery from '../hooks/useQuery';

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



  return (
    <div className="p-6">
      {/* Header */}
      <ReviewHeader onAddReview={handleAdd} />

      {/* Filters */}
      <ReviewFilters query={query} onQueryUpdate={updateQuery} />

      {/* Reviews Table */}
      <ReviewTable
        reviews={reviews}
        meta={meta}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onPageChange={(page: React.SetStateAction<number>) => {
          const newPage = typeof page === 'function' ? page(meta?.pageNumber || 1) : page;
          updateQuery({ page: newPage });
        }}
      />

      {/* Modals */}
      <ReviewModals
        showForm={showForm}
        showDetail={showDetail}
        showDeleteConfirm={showDeleteConfirm}
        selectedReview={selectedReview}
        isEditing={isEditing}
        onFormSubmit={handleSubmit}
        onFormCancel={() => setShowForm(false)}
        onDetailClose={() => setShowDetail(false)}
        onDetailEdit={() => {
          setShowDetail(false);
          handleEdit(selectedReview!);
        }}
        onDetailDelete={() => {
          setShowDetail(false);
          handleDelete(selectedReview!);
        }}
        onDetailStatusChange={(status: string) => {
          handleStatusChange(selectedReview!, status);
          setShowDetail(false);
        }}
        onDeleteConfirm={confirmDelete}
        onDeleteCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default Reviews;
