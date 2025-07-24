import React from 'react';
import { Plus, Building2, Users, Trash, Armchair } from 'lucide-react';
import type { Theater } from '../../types/global-types';

interface SeatHeaderProps {
  selectedTheater: Theater | null;
  selectedSeats: number[];
  onTheaterSelect: () => void;
  onBulkDelete: () => void;
  onBulkCreate: () => void;
  onAddSeat: () => void;
}

const SeatHeader: React.FC<SeatHeaderProps> = ({
  selectedTheater,
  selectedSeats,
  onTheaterSelect,
  onBulkDelete,
  onBulkCreate,
  onAddSeat
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Armchair className="text-blue-500" />
          Quản lý ghế ngồi
          {selectedTheater && (
            <span className="text-lg text-gray-500 dark:text-gray-400">
              - {selectedTheater.name}
            </span>
          )}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {selectedTheater
            ? `Sơ đồ ghế rạp ${selectedTheater.name} - Chế độ xem trực quan`
            : 'Chọn rạp để xem sơ đồ ghế và quản lý ghế ngồi'
          }
        </p>
      </div>
      
      <div className="flex items-center gap-3">

        {/* Theater Selector */}
        <button
          onClick={onTheaterSelect}
          className="btn btn-secondary flex items-center gap-2"
          title={selectedTheater ? 'Đổi rạp khác' : 'Chọn rạp để quản lý'}
        >
          <Building2 size={16} />
          {selectedTheater ? 'Đổi rạp' : 'Chọn rạp'}
        </button>

        {/* Bulk Actions */}
        {selectedSeats.length > 0 && (
          <button
            onClick={onBulkDelete}
            className="btn btn-danger flex items-center gap-2"
            title={`Xóa ${selectedSeats.length} ghế đã chọn`}
          >
            <Trash size={16} />
            Xóa {selectedSeats.length} ghế
          </button>
        )}

        {/* Bulk Create */}
        <button
          onClick={onBulkCreate}
          className="btn btn-success flex items-center gap-2"
          title="Tạo nhiều ghế cùng lúc"
        >
          <Users size={16} />
          Tạo hàng loạt
        </button>

        {/* Add Single */}
        <button
          onClick={onAddSeat}
          className="btn btn-primary flex items-center gap-2"
          title="Thêm ghế mới"
        >
          <Plus size={20} />
          Thêm ghế
        </button>
      </div>
    </div>
  );
};

export default SeatHeader;
