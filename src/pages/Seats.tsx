import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, Armchair, Building2, DollarSign, Grid3X3, List, Users } from 'lucide-react';
import SeatForm from '../components/seats/SeatForm';
import SeatDetail from '../components/seats/SeatDetail';
import TheaterSelector from '../components/seats/TheaterSelector';
import SeatMap from '../components/seats/SeatMap';
import BulkSeatForm from '../components/seats/BulkSeatForm';
import SeatStats from '../components/seats/SeatStats';
import DeleteConfirmation from '../components/DeleteConfirmation';
import ServiceApi from '../services/api';
import type { Seat, Theater, Meta } from '../types/global-types';
import useQuery from '../hooks/useQuery';
import Pagination from '../components/pagination';
import { formatDateTime } from '../types/format-datetime';
import formatMoney from '../types/format-money';

const Seats: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // New states for theater-specific management
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [showTheaterSelector, setShowTheaterSelector] = useState(false);
  const [theaterSeats, setTheaterSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [showBulkForm, setShowBulkForm] = useState(false);

  const [query, updateQuery] = useQuery({
    page: 1,
    limit: 10,
    search: '',
    theaterId: 'all',
    type: 'all',
    sort: 'id',
    order: 'desc'
  });

  // Fetch seats
  const fetchSeats = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: query.page,
        limit: query.limit,
        search: query.search,
        sort: query.sort,
        order: query.order,
      };

      if (query.theaterId !== 'all') {
        params.theaterId = query.theaterId;
      }
      if (query.type !== 'all') {
        params.type = query.type;
      }

      const response = await ServiceApi.get('/seats', { params });
      setSeats(response.data.data.data || []);
      setMeta(response.data.data.meta);
    } catch (error) {
      console.error('Error fetching seats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch theaters for filter
  const fetchTheaters = async () => {
    try {
      const response = await ServiceApi.get('/theaters');
      setTheaters(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching theaters:', error);
    }
  };

  // Fetch seats by theater
  const fetchSeatsByTheater = async (theaterId: number) => {
    try {
      setLoading(true);
      const response = await ServiceApi.get(`/seats/theater/${theaterId}`);
      console.log(response.data.data);
      setTheaterSeats(response.data.data || []);
    } catch (error) {
      console.error('Error fetching theater seats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle theater selection
  const handleTheaterSelect = (theater: Theater) => {
    setSelectedTheater(theater);
    setShowTheaterSelector(false);
    fetchSeatsByTheater(theater.id);
    updateQuery({ theaterId: theater.id.toString() });
  };

  // Handle bulk seat creation
  const handleBulkCreateSeats = async (theaterData: {
    theaterId: number;
    rows: string[];
    seatsPerRow: number;
    type: string;
    price: number;
  }) => {
    try {
      setLoading(true);
      await ServiceApi.post('/seats/bulk', theaterData);
      if (selectedTheater) {
        await fetchSeatsByTheater(selectedTheater.id);
      }
      await fetchSeats();
    } catch (error) {
      console.error('Error creating bulk seats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedSeats.length === 0) return;

    try {
      setLoading(true);
      await ServiceApi.delete('/seats/bulk', { data: { seatIds: selectedSeats } });
      if (selectedTheater) {
        await fetchSeatsByTheater(selectedTheater.id);
      }
      await fetchSeats();
      setSelectedSeats([]);
    } catch (error) {
      console.error('Error deleting bulk seats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [query]);

  useEffect(() => {
    fetchTheaters();
  }, []);

  const handleAdd = () => {
    setSelectedSeat(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (seat: Seat) => {
    setSelectedSeat(seat);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (seat: Seat) => {
    setSelectedSeat(seat);
    setShowDeleteConfirm(true);
  };

  const handleView = (seat: Seat) => {
    setSelectedSeat(seat);
    setShowDetail(true);
  };

  const handleSubmit = async (seatData: Omit<Seat, 'id'>) => {
    try {
      if (isEditing && selectedSeat) {
        await ServiceApi.patch(`/seats/${selectedSeat.id}`, seatData);
      } else {
        await ServiceApi.post('/seats', seatData);
      }
      await fetchSeats();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving seat:', error);
    }
  };

  const confirmDelete = async () => {
    if (selectedSeat) {
      try {
        await ServiceApi.delete(`/seats/${selectedSeat.id}`);
        await fetchSeats();
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error('Error deleting seat:', error);
      }
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

  const getTheaterName = (theaterId: number) => {
    const theater = theaters.find(t => t.id === theaterId);
    return theater?.name || 'Unknown Theater';
  };

  return (
    <div className="p-6">
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
              ? `Quản lý ghế trong rạp ${selectedTheater.name}`
              : 'Quản lý ghế ngồi trong các rạp chiếu phim'
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Grid3X3 size={16} />
            </button>
          </div>

          {/* Theater Selector */}
          <button
            onClick={() => setShowTheaterSelector(true)}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Building2 size={16} />
            {selectedTheater ? 'Đổi rạp' : 'Chọn rạp'}
          </button>

          {/* Bulk Actions */}
          {selectedSeats.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="btn btn-danger flex items-center gap-2"
            >
              <Trash size={16} />
              Xóa {selectedSeats.length} ghế
            </button>
          )}

          {/* Bulk Create */}
          <button
            onClick={() => setShowBulkForm(true)}
            className="btn btn-success flex items-center gap-2"
          >
            <Users size={16} />
            Tạo hàng loạt
          </button>

          {/* Add Single */}
          <button
            onClick={handleAdd}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Thêm ghế
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm ghế..."
              value={query.search}
              onChange={(e) => updateQuery({ search: e.target.value, page: 1 })}
              className="input pl-10"
            />
          </div>

          <select
            value={query.theaterId}
            onChange={(e) => updateQuery({ theaterId: e.target.value, page: 1 })}
            className="input"
          >
            <option value="all">Tất cả rạp</option>
            {theaters.map(theater => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </select>

          <select
            value={query.type}
            onChange={(e) => updateQuery({ type: e.target.value, page: 1 })}
            className="input"
          >
            <option value="all">Tất cả loại ghế</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
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
            <option value="row-asc">Hàng A-Z</option>
            <option value="row-desc">Hàng Z-A</option>
            <option value="number-asc">Số ghế tăng dần</option>
            <option value="number-desc">Số ghế giảm dần</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>
      </div>

      {/* Theater Stats */}
      {selectedTheater && theaterSeats.length > 0 && (
        <div className="mb-6">
          <SeatStats theater={selectedTheater} seats={theaterSeats} />
        </div>
      )}

      {/* Content based on view mode */}
      {viewMode === 'grid' && selectedTheater ? (
        /* Seat Map View */
        <SeatMap
          seats={theaterSeats}
          selectedSeats={selectedSeats}
          onSeatSelect={(seatId) => {
            setSelectedSeats(prev =>
              prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
            );
          }}
          onSeatEdit={handleEdit}
          onSeatView={handleView}
        />
      ) : (
        /* List View */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ghế
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rạp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Loại ghế
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Giá
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
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : seats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Không có ghế nào được tìm thấy
                  </td>
                </tr>
              ) : (
                seats.map((seat) => (
                  <tr key={seat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <Armchair className="text-blue-600 dark:text-blue-400" size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {seat.row}{seat.number}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Hàng {seat.row}, Ghế {seat.number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="text-gray-400 mr-2" size={16} />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {getTheaterName(seat.theaterId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeatTypeColor(seat.type)}`}>
                        {seat.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="text-green-500 mr-1" size={16} />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatMoney(seat.price)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {seat.createdAt ? formatDateTime(seat.createdAt) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(seat)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Xem
                        </button>
                        <button
                          onClick={() => handleEdit(seat)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(seat)}
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
      )}

      {/* Modals */}
      {showForm && (
        <SeatForm
          seat={selectedSeat}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showDetail && selectedSeat && (
        <SeatDetail
          seat={selectedSeat}
          onClose={() => setShowDetail(false)}
          onEdit={() => {
            setShowDetail(false);
            handleEdit(selectedSeat);
          }}
          onDelete={() => {
            setShowDetail(false);
            handleDelete(selectedSeat);
          }}
        />
      )}

      {showDeleteConfirm && selectedSeat && (
        <DeleteConfirmation
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title="Xóa ghế"
          message={`Bạn có chắc chắn muốn xóa ghế ${selectedSeat.row}${selectedSeat.number}?`}
        />
      )}

      {/* Theater Selector Modal */}
      {showTheaterSelector && (
        <TheaterSelector
          theaters={theaters}
          onSelect={handleTheaterSelect}
          onClose={() => setShowTheaterSelector(false)}
        />
      )}

      {/* Bulk Seat Form Modal */}
      {showBulkForm && (
        <BulkSeatForm
          theater={selectedTheater}
          onSubmit={handleBulkCreateSeats}
          onCancel={() => setShowBulkForm(false)}
        />
      )}
    </div>
  );
};

export default Seats;
