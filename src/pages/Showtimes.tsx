import React, { useState } from 'react';
import { useShowtimes } from '../contexts/ShowtimeContext';
import { Search, Plus, Calendar, Clock, MoreVertical, Edit, Trash, Film, Building2 } from 'lucide-react';
import { useMovies } from '../contexts/MovieContext';
import { useTheaters } from '../contexts/TheaterContext';
import DeleteConfirmation from '../components/DeleteConfirmation';
import ShowtimeForm from '../components/showtimes/ShowtimeForm';
import ShowtimeDetail from '../components/showtimes/ShowtimeDetail';

const Showtimes: React.FC = () => {
  const { showtimes, deleteShowtime, getShowtime, addShowtime, updateShowtime } = useShowtimes();
  const { movies } = useMovies();
  const { theaters } = useTheaters();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShowtimeId, setEditingShowtimeId] = useState<number | null>(null);
  const [viewingShowtimeId, setViewingShowtimeId] = useState<number | null>(null);
  const [deletingShowtimeId, setDeletingShowtimeId] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterMovieId, setFilterMovieId] = useState<number | null>(null);
  const [filterTheaterId, setFilterTheaterId] = useState<number | null>(null);

  // Filter showtimes
  const filteredShowtimes = showtimes.filter(showtime => {
    // Search term filter
    const movieTitle = movies.find(m => m.id === showtime.movieId)?.title || '';
    const theaterName = theaters.find(t => t.id === showtime.theaterId)?.name || '';
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
      movieTitle.toLowerCase().includes(searchLower) ||
      theaterName.toLowerCase().includes(searchLower) ||
      showtime.date.includes(searchLower) ||
      showtime.time.toLowerCase().includes(searchLower);
    
    // Date filter
    const matchesDate = filterDate ? showtime.date === filterDate : true;
    
    // Movie filter
    const matchesMovie = filterMovieId ? showtime.movieId === filterMovieId : true;
    
    // Theater filter
    const matchesTheater = filterTheaterId ? showtime.theaterId === filterTheaterId : true;
    
    return matchesSearch && matchesDate && matchesMovie && matchesTheater;
  });

  const handleDeleteShowtime = () => {
    if (deletingShowtimeId !== null) {
      deleteShowtime(deletingShowtimeId);
      setDeletingShowtimeId(null);
    }
  };

  // Get unique dates for filter
  const uniqueDates = [...new Set(showtimes.map(s => s.date))].sort();

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100/70 dark:bg-blue-900/30">
            <Calendar size={24} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Quản lý suất chiếu</h1>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center gap-2 hover-lift"
        >
          <Plus size={18} />
          <span>Thêm suất chiếu</span>
        </button>
      </div>

      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm suất chiếu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border-none rounded-xl bg-gray-50/80 dark:bg-gray-700/80 focus:ring-2 focus:ring-primary-500/70 transition-all"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Date filter */}
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-50/80 dark:bg-gray-700/80 border-none focus:ring-2 focus:ring-primary-500/70"
            >
              <option value="">Tất cả ngày</option>
              {uniqueDates.map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
                </option>
              ))}
            </select>
            
            {/* Movie filter */}
            <select
              value={filterMovieId || ''}
              onChange={(e) => setFilterMovieId(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-2 rounded-lg bg-gray-50/80 dark:bg-gray-700/80 border-none focus:ring-2 focus:ring-primary-500/70"
            >
              <option value="">Tất cả phim</option>
              {movies.map(movie => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
            
            {/* Theater filter */}
            <select
              value={filterTheaterId || ''}
              onChange={(e) => setFilterTheaterId(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-2 rounded-lg bg-gray-50/80 dark:bg-gray-700/80 border-none focus:ring-2 focus:ring-primary-500/70"
            >
              <option value="">Tất cả rạp</option>
              {theaters.map(theater => (
                <option key={theater.id} value={theater.id}>
                  {theater.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Showtimes Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left">Phim</th>
                <th className="px-4 py-3 text-left">Rạp</th>
                <th className="px-4 py-3 text-left">Ngày</th>
                <th className="px-4 py-3 text-left">Giờ</th>
                <th className="px-4 py-3 text-left">Giá</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredShowtimes.length > 0 ? (
                filteredShowtimes.map((showtime) => {
                  const movie = movies.find(m => m.id === showtime.movieId);
                  const theater = theaters.find(t => t.id === showtime.theaterId);
                  
                  return (
                    <tr 
                      key={showtime.id} 
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer"
                      onClick={() => setViewingShowtimeId(showtime.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {movie?.posterPath ? (
                            <img 
                              src={movie.posterPath} 
                              alt={movie?.title} 
                              className="w-10 h-14 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                              <Film size={16} />
                            </div>
                          )}
                          <div className="font-medium">{movie?.title || 'Unknown Movie'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-purple-500" />
                          <span>{theater?.name || 'Unknown Theater'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {new Date(showtime.date).toLocaleDateString('vi-VN', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-blue-500" />
                          <span>{showtime.time}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {showtime.price.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingShowtimeId(showtime.id);
                            }}
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingShowtimeId(showtime.id);
                            }}
                            className="p-1.5 rounded-md hover:bg-error-50 dark:hover:bg-error-900/20 text-error-500 transition-colors"
                            title="Xóa"
                          >
                            <Trash size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingShowtimeId(showtime.id);
                            }}
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Xem chi tiết"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <Clock size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Không tìm thấy suất chiếu nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Showtime Form */}
      {showAddForm && (
        <ShowtimeForm
          onSubmit={(showtimeData) => {
            addShowtime(showtimeData);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Showtime Form */}
      {editingShowtimeId !== null && (
        <ShowtimeForm
          showtime={getShowtime(editingShowtimeId)}
          onSubmit={(showtimeData) => {
            updateShowtime(editingShowtimeId, showtimeData);
            setEditingShowtimeId(null);
          }}
          onCancel={() => setEditingShowtimeId(null)}
        />
      )}

      {/* View Showtime Detail */}
      {viewingShowtimeId !== null && (
        <ShowtimeDetail
          showtime={getShowtime(viewingShowtimeId)!}
          onClose={() => setViewingShowtimeId(null)}
          onEdit={() => {
            setEditingShowtimeId(viewingShowtimeId);
            setViewingShowtimeId(null);
          }}
          onDelete={() => {
            setDeletingShowtimeId(viewingShowtimeId);
            setViewingShowtimeId(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deletingShowtimeId !== null && (
        <DeleteConfirmation
          title="Xóa suất chiếu"
          message="Bạn có chắc chắn muốn xóa suất chiếu này? Hành động này không thể hoàn tác."
          onConfirm={handleDeleteShowtime}
          onCancel={() => setDeletingShowtimeId(null)}
        />
      )}
    </div>
  );
};

export default Showtimes; 