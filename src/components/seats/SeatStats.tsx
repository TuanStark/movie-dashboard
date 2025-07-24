import React from 'react';
import { Armchair, Users, DollarSign, TrendingUp } from 'lucide-react';
import type { Seat, Theater } from '../../types/global-types';
import formatMoney from '../../types/format-money';

interface SeatStatsProps {
  theater: Theater;
  seats: Seat[];
}

const SeatStats: React.FC<SeatStatsProps> = ({ theater, seats }) => {
  // Calculate statistics
  const totalSeats = seats.length;
  const seatsByType = seats.reduce((acc, seat) => {
    acc[seat.type] = (acc[seat.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const seatsByRow = seats.reduce((acc, seat) => {
    acc[seat.row] = (acc[seat.row] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = seats.reduce((sum, seat) => sum + seat.price, 0);
  const averagePrice = totalSeats > 0 ? totalValue / totalSeats : 0;

  const rows = Object.keys(seatsByRow).sort();

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vip':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'premium':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <TrendingUp className="text-blue-500" />
        Thống kê ghế - {theater.name}
      </h3>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Tổng ghế</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalSeats}</p>
            </div>
            <Armchair className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Số hàng</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{rows.length}</p>
            </div>
            <Users className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400">Giá TB</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatMoney(averagePrice)}
              </p>
            </div>
            <DollarSign className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400">Tổng giá trị</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {formatMoney(totalValue)}
              </p>
            </div>
            <TrendingUp className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Seat Types Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Phân bố theo loại ghế</h4>
          <div className="space-y-3">
            {Object.entries(seatsByType).map(([type, count]) => {
              const percentage = totalSeats > 0 ? (count / totalSeats) * 100 : 0;
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(type)}`}>
                      {type === 'VIP' ? 'VIP' : 'Tiêu chuẩn'}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {count} ghế
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          type.toLowerCase() === 'vip' ? 'bg-yellow-500' :
                          type.toLowerCase() === 'premium' ? 'bg-purple-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row Details */}
      {rows.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Chi tiết theo hàng</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {rows.map(row => (
              <div key={row} className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center">
                <div className="font-medium text-gray-900 dark:text-white">Hàng {row}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {seatsByRow[row]} ghế
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatStats;
