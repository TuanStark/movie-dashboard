import React from 'react';
import ReviewForm from './ReviewForm';
import ReviewDetail from './ReviewDetail';
import DeleteConfirmation from '../DeleteConfirmation';
import type { Review } from '../../types/global-types';

interface ReviewModalsProps {
  // Modal states
  showForm: boolean;
  showDetail: boolean;
  showDeleteConfirm: boolean;
  
  // Data
  selectedReview: Review | null;
  isEditing: boolean;
  
  // Handlers
  onFormSubmit: (reviewData: Omit<Review, 'id' | 'user' | 'movie'>) => Promise<void>;
  onFormCancel: () => void;
  onDetailClose: () => void;
  onDetailEdit: () => void;
  onDetailDelete: () => void;
  onDetailStatusChange: (status: string) => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

const ReviewModals: React.FC<ReviewModalsProps> = ({
  // Modal states
  showForm,
  showDetail,
  showDeleteConfirm,
  
  // Data
  selectedReview,
  isEditing,
  
  // Handlers
  onFormSubmit,
  onFormCancel,
  onDetailClose,
  onDetailEdit,
  onDetailDelete,
  onDetailStatusChange,
  onDeleteConfirm,
  onDeleteCancel
}) => {
  return (
    <>
      {/* Review Form Modal */}
      {showForm && (
        <ReviewForm
          review={selectedReview}
          onSubmit={onFormSubmit}
          onCancel={onFormCancel}
        />
      )}

      {/* Review Detail Modal */}
      {showDetail && selectedReview && (
        <ReviewDetail
          review={selectedReview}
          onClose={onDetailClose}
          onEdit={onDetailEdit}
          onDelete={onDetailDelete}
          onStatusChange={onDetailStatusChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedReview && (
        <DeleteConfirmation
          onCancel={onDeleteCancel}
          onConfirm={onDeleteConfirm}
          title="Xóa đánh giá"
          message="Bạn có chắc chắn muốn xóa đánh giá này?"
        />
      )}
    </>
  );
};

export default ReviewModals;
