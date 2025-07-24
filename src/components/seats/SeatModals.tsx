import React from 'react';
import SeatForm from './SeatForm';
import SeatDetail from './SeatDetail';
import TheaterSelector from './TheaterSelector';
import BulkSeatForm from './BulkSeatForm';
import DeleteConfirmation from '../DeleteConfirmation';
import type { Seat, Theater } from '../../types/global-types';

interface SeatModalsProps {
  // Modal states
  showForm: boolean;
  showDetail: boolean;
  showTheaterSelector: boolean;
  showBulkForm: boolean;
  showDeleteConfirm: boolean;
  
  // Data
  selectedSeat: Seat | null;
  selectedTheater: Theater | null;
  theaters: Theater[];
  isEditing: boolean;
  
  // Handlers
  onFormSubmit: (seatData: Omit<Seat, 'id'>) => Promise<void>;
  onFormCancel: () => void;
  onDetailClose: () => void;
  onDetailEdit: () => void;
  onDetailDelete: () => void;
  onTheaterSelect: (theater: Theater) => void;
  onTheaterSelectorClose: () => void;
  onBulkSubmit: (data: {
    theaterId: number;
    rows: string[];
    seatsPerRow: number;
    type: string;
    price: number;
  }) => Promise<void>;
  onBulkCancel: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

const SeatModals: React.FC<SeatModalsProps> = ({
  // Modal states
  showForm,
  showDetail,
  showTheaterSelector,
  showBulkForm,
  showDeleteConfirm,
  
  // Data
  selectedSeat,
  selectedTheater,
  theaters,
  isEditing,
  
  // Handlers
  onFormSubmit,
  onFormCancel,
  onDetailClose,
  onDetailEdit,
  onDetailDelete,
  onTheaterSelect,
  onTheaterSelectorClose,
  onBulkSubmit,
  onBulkCancel,
  onDeleteConfirm,
  onDeleteCancel
}) => {
  return (
    <>
      {/* Seat Form Modal */}
      {showForm && (
        <SeatForm
          seat={selectedSeat}
          onSubmit={onFormSubmit}
          onCancel={onFormCancel}
        />
      )}

      {/* Seat Detail Modal */}
      {showDetail && selectedSeat && (
        <SeatDetail
          seat={selectedSeat}
          onClose={onDetailClose}
          onEdit={onDetailEdit}
          onDelete={onDetailDelete}
        />
      )}

      {/* Theater Selector Modal */}
      {showTheaterSelector && (
        <TheaterSelector
          theaters={theaters}
          onSelect={onTheaterSelect}
          onClose={onTheaterSelectorClose}
        />
      )}

      {/* Bulk Seat Form Modal */}
      {showBulkForm && (
        <BulkSeatForm
          theater={selectedTheater}
          onSubmit={onBulkSubmit}
          onCancel={onBulkCancel}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedSeat && (
        <DeleteConfirmation
          onCancel={onDeleteCancel}
          onConfirm={onDeleteConfirm}
          title="Xóa ghế"
          message={`Bạn có chắc chắn muốn xóa ghế ${selectedSeat.row}${selectedSeat.number}?`}
        />
      )}
    </>
  );
};

export default SeatModals;
