import React from 'react';
import { Armchair, Monitor } from 'lucide-react';
import type { Seat } from '../../types/global-types';
import formatMoney from '../../types/format-money';

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: number[];
  onSeatSelect: (seatId: number) => void;
  onSeatEdit: (seat: Seat) => void;
  onSeatView: (seat: Seat) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ 
  seats, 
  selectedSeats, 
  onSeatSelect, 
  onSeatEdit, 
  onSeatView 
}) => {
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  const getSeatColor = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.id);
    
    if (isSelected) {
      return 'bg-blue-500 text-white border-blue-600';
    }
    
    switch (seat.type.toLowerCase()) {
      case 'vip':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-600';
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-600';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const handleSeatClick = (seat: Seat, event: React.MouseEvent) => {
    event.preventDefault();
    
    if (event.ctrlKey || event.metaKey) {
      // Multi-select with Ctrl/Cmd
      onSeatSelect(seat.id);
    } else if (event.shiftKey) {
      // Range select with Shift (could be implemented later)
      onSeatSelect(seat.id);
    } else if (event.detail === 2) {
      // Double click to edit
      onSeatEdit(seat);
    } else {
      // Single click to view
      onSeatView(seat);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      {/* Screen */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 dark:bg-gray-600 text-white px-8 py-3 rounded-lg flex items-center gap-2">
          <Monitor size={20} />
          <span className="font-medium">MÀN HÌNH</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
            <Armchair size={14} className="text-gray-600" />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Standard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-purple-100 border border-purple-300 rounded flex items-center justify-center">
            <Armchair size={14} className="text-purple-600" />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Premium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center">
            <Armchair size={14} className="text-yellow-600" />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">VIP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 border border-blue-600 rounded flex items-center justify-center">
            <Armchair size={14} className="text-white" />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Đã chọn</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="space-y-3">
        {sortedRows.map((row) => {
          const rowSeats = seatsByRow[row].sort((a, b) => a.number - b.number);
          
          return (
            <div key={row} className="flex items-center gap-2">
              {/* Row Label */}
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center font-medium text-sm">
                {row}
              </div>
              
              {/* Seats */}
              <div className="flex gap-1 flex-wrap">
                {rowSeats.map((seat) => (
                  <div
                    key={seat.id}
                    onClick={(e) => handleSeatClick(seat, e)}
                    className={`
                      w-10 h-10 border-2 rounded cursor-pointer transition-all duration-200 
                      flex items-center justify-center text-xs font-medium
                      hover:scale-105 hover:shadow-md
                      ${getSeatColor(seat)}
                    `}
                    title={`${seat.row}${seat.number} - ${seat.type.toUpperCase()} - ${formatMoney(seat.price)}`}
                  >
                    <Armchair size={16} />
                  </div>
                ))}
              </div>
              
              {/* Seat Numbers */}
              <div className="flex gap-1 flex-wrap ml-2">
                {rowSeats.map((seat) => (
                  <div
                    key={`label-${seat.id}`}
                    className="w-10 text-center text-xs text-gray-500 dark:text-gray-400"
                  >
                    {seat.number}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {seats.length === 0 && (
        <div className="text-center py-12">
          <Armchair className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 dark:text-gray-400">
            Chưa có ghế nào trong rạp này
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Hướng dẫn:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Click để xem chi tiết ghế</li>
          <li>• Double-click để chỉnh sửa ghế</li>
          <li>• Ctrl/Cmd + Click để chọn nhiều ghế</li>
          <li>• Hover để xem thông tin nhanh</li>
        </ul>
      </div>
    </div>
  );
};

export default SeatMap;
