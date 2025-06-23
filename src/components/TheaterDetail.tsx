import React, { useState } from 'react';
import type { Theater } from '../data/mock-data';
import { X, Edit, Trash, MapPin, Calendar, Clock, DollarSign, Star } from 'lucide-react';
import { useShowtimes } from '../contexts/ShowtimeContext';
import { movies } from '../data/mock-data';

interface TheaterDetailProps {
  theater: Theater;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TheaterDetail: React.FC<TheaterDetailProps> = ({ theater, onClose, onEdit, onDelete }) => {
  const { getShowtimesByTheater, getMoviesByTheater } = useShowtimes();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const theaterShowtimes = getShowtimesByTheater(theater.id);
  const theaterMovies = getMoviesByTheater(theater.id);
  console.log(theaterMovies);
  
  // Lấy danh sách các ngày có suất chiếu tại rạp
  const availableDates = [...new Set(theaterShowtimes.map(showtime => showtime.date))].sort();
  
  // Nếu chưa chọn ngày, chọn ngày đầu tiên
  React.useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);
  
  // Lọc suất chiếu theo ngày đã chọn
  const filteredShowtimes = selectedDate 
    ? theaterShowtimes.filter(showtime => showtime.date === selectedDate)
    : theaterShowtimes;
  
  // Nhóm suất chiếu theo phim
  const showtimesByMovie = filteredShowtimes.reduce((acc, showtime) => {
    const movieId = showtime.movieId;
    if (!acc[movieId]) {
      acc[movieId] = [];
    }
    acc[movieId].push(showtime);
    return acc;
  }, {} as Record<number, typeof filteredShowtimes>);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chi tiết rạp chiếu phim</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{theater.name}</h3>
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <MapPin size={18} className="mt-0.5 flex-shrink-0" />
              <p>{theater.location}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-2">Tọa độ</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vĩ độ (Latitude)</p>
                <p className="font-medium">{theater.coordinates.lat}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Kinh độ (Longitude)</p>
                <p className="font-medium">{theater.coordinates.lng}</p>
              </div>
            </div>
          </div>
          
          {/* Map placeholder - in a real app, you would integrate with a mapping service */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center mb-6">
            <p className="text-gray-500 dark:text-gray-400">Bản đồ sẽ được hiển thị ở đây</p>
          </div>
          
          {/* Movies and Showtimes Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Phim đang chiếu tại rạp</h3>
            
            {availableDates.length > 0 ? (
              <>
                {/* Date Selector */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {availableDates.map(date => (
                    <button
                      key={date}
                      className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        selectedDate === date 
                          ? "bg-primary-100/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500/50"
                          : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover-lift"
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <Calendar size={16} />
                      <span>{new Date(date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}</span>
                    </button>
                  ))}
                </div>
                
                {/* Movies with Showtimes */}
                <div className="space-y-6">
                  {Object.entries(showtimesByMovie).map(([movieId, showtimes]) => {
                    const movie = movies.find(m => m.id === parseInt(movieId));
                    if (!movie) return null;
                    
                    return (
                      <div key={movieId} className="glass-card p-4 rounded-xl">
                        <div className="flex items-start gap-3 mb-3">
                          <img 
                            src={movie.posterPath} 
                            alt={movie.title}
                            className="w-16 h-24 object-cover rounded-lg shadow-md"
                          />
                          <div>
                            <h4 className="font-medium">{movie.title}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <Star size={14} className="text-yellow-500 mr-1" fill="#FFD700" />
                                <span>{movie.rating}/10</span>
                              </div>
                              <div className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                <span>{movie.duration}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {movie.genres.slice(0, 2).map((genre, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-gray-100/80 dark:bg-gray-700/80 rounded-full text-xs"
                                  >
                                    {genre}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {showtimes.map(showtime => (
                            <div 
                              key={showtime.id}
                              className="px-4 py-2 bg-white/80 dark:bg-gray-700/80 rounded-lg flex items-center gap-2 hover-lift cursor-pointer"
                            >
                              <Clock size={16} className="text-gray-500 dark:text-gray-400" />
                              <span>{showtime.time}</span>
                              <span className="text-sm text-gray-400 dark:text-gray-500">|</span>
                              <div className="flex items-center text-success-600 dark:text-success-400">
                                <DollarSign size={14} />
                                <span>{showtime.price.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8 glass-card rounded-xl">
                <p className="text-gray-500 dark:text-gray-400">Không có suất chiếu nào tại rạp này</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onDelete}
            className="btn btn-error btn-sm flex items-center gap-1"
          >
            <Trash size={16} />
            <span>Xóa</span>
          </button>
          <button
            onClick={onEdit}
            className="btn btn-primary btn-sm flex items-center gap-1"
          >
            <Edit size={16} />
            <span>Sửa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheaterDetail; 