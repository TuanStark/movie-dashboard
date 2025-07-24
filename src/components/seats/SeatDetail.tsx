import React, { useState, useEffect } from 'react';
import { X, Edit, Trash, Armchair, Building2, DollarSign, Calendar, MapPin } from 'lucide-react';
import type { Seat, Theater } from '../../types/global-types';
import ServiceApi from '../../services/api';
import { formatDateTime } from '../../types/format-datetime';
import formatMoney from '../../types/format-money';

interface SeatDetailProps {
  seat: Seat;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SeatDetail: React.FC<SeatDetailProps> = ({ seat, onClose, onEdit, onDelete }) => {
  const [theater, setTheater] = useState<Theater | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTheater();
  }, [seat.theaterId]);

  const fetchTheater = async () => {
    try {
      setLoading(true);
      const response = await ServiceApi.get(`/theaters/${seat.theaterId}`);
      setTheater(response.data.data);
    } catch (error) {
      console.error('Error fetching theater:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeatTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vip':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSeatTypeDescription = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vip':
        return 'Ghế VIP với không gian rộng rãi và dịch vụ cao cấp';
      case 'premium':
        return 'Ghế Premium với chất lượng tốt và thoải mái';
      default:
        return 'Ghế Standard với chất lượng cơ bản';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Armchair className="text-blue-500" />
            Chi tiết ghế {seat.row}{seat.number}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-500 dark:text-gray-400">Đang tải...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Seat Visual */}
              <div className="flex items-center justify-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Armchair className="text-blue-600 dark:text-blue-400" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {seat.row}{seat.number}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Hàng {seat.row}, Ghế số {seat.number}
                  </p>
                </div>
              </div>

              {/* Seat Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-2">Thông tin ghế</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Hàng ghế:</span>
                        <span className="font-medium">{seat.row}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Số ghế:</span>
                        <span className="font-medium">{seat.number}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Loại ghế:</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeatTypeColor(seat.type)}`}>
                          {seat.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Giá ghế:</span>
                        <div className="flex items-center">
                          <DollarSign className="text-green-500 mr-1" size={16} />
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {formatMoney(seat.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-2">Mô tả</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getSeatTypeDescription(seat.type)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Theater Information */}
                  {theater && (
                    <div>
                      <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-2">Thông tin rạp</h4>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={theater.logo}
                            alt={theater.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {theater.name}
                            </h5>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <MapPin size={14} className="mr-1" />
                              {theater.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div>
                    <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-2">Thời gian</h4>
                    <div className="space-y-2">
                      {seat.createdAt && (
                        <div className="flex items-center text-sm">
                          <Calendar className="text-gray-400 mr-2" size={16} />
                          <span className="text-gray-600 dark:text-gray-400">Tạo:</span>
                          <span className="ml-2 font-medium">{formatDateTime(seat.createdAt)}</span>
                        </div>
                      )}
                      {seat.updatedAt && (
                        <div className="flex items-center text-sm">
                          <Calendar className="text-gray-400 mr-2" size={16} />
                          <span className="text-gray-600 dark:text-gray-400">Cập nhật:</span>
                          <span className="ml-2 font-medium">{formatDateTime(seat.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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

export default SeatDetail;
