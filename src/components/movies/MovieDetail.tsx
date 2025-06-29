import React, { useState } from 'react';
import type { Movie } from '../../data/mock-data';
import { X, Star, Clock, Calendar, Video, ExternalLink, MapPin, DollarSign, Calendar as CalendarIcon } from 'lucide-react';
import { useShowtimes } from '../../contexts/ShowtimeContext';
import { theaters } from '../../data/mock-data';

interface MovieDetailProps {
  movie: Movie;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, onClose, onEdit, onDelete }) => {
  const { getShowtimesByMovie, getTheatersByMovie } = useShowtimes();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const movieShowtimes = getShowtimesByMovie(movie.id);
  const movieTheaters = getTheatersByMovie(movie.id);
  
  // Lấy danh sách các ngày có suất chiếu của phim
  const availableDates = [...new Set(movieShowtimes.map(showtime => showtime.date))].sort();
  
  // Nếu chưa chọn ngày, chọn ngày đầu tiên
  React.useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);
  
  // Lọc suất chiếu theo ngày đã chọn
  const filteredShowtimes = selectedDate 
    ? movieShowtimes.filter(showtime => showtime.date === selectedDate)
    : movieShowtimes;
  
  // Nhóm suất chiếu theo rạp
  const showtimesByTheater = filteredShowtimes.reduce((acc, showtime) => {
    const theaterId = showtime.theaterId;
    if (!acc[theaterId]) {
      acc[theaterId] = [];
    }
    acc[theaterId].push(showtime);
    return acc;
  }, {} as Record<number, typeof filteredShowtimes>);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="relative">
          {/* Backdrop image */}
          <div className="h-64 w-full overflow-hidden">
            <img 
              src={movie.backdropPath} 
              alt={`${movie.title} backdrop`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
          >
            <X size={20} />
          </button>
          
          {/* Movie info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-start gap-4">
              <img 
                src={movie.posterPath} 
                alt={movie.title} 
                className="w-32 h-48 object-cover rounded-lg shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold">{movie.title}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 mr-1" fill="#FFD700" />
                    <span>{movie.rating}/10</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>{movie.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>{movie.releaseDate}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {movie.genres.map((genre) => (
                    <span 
                      key={genre} 
                      className="px-2 py-1 bg-white/20 rounded-full text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Chi tiết phim</h2>
            <div className="flex gap-2">
              <button 
                onClick={onEdit}
                className="btn btn-secondary btn-sm"
              >
                Chỉnh sửa
              </button>
              <button 
                onClick={onDelete}
                className="btn btn-sm bg-error-500 hover:bg-error-600 text-white"
              >
                Xóa
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Tóm tắt</h3>
              <p className="text-gray-600 dark:text-gray-300">{movie.synopsis}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Thông tin</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Đạo diễn:</span> {movie.director}
                </div>
                <div>
                  <span className="font-medium">Diễn viên:</span> {movie.cast.join(', ')}
                </div>
                <div>
                  <span className="font-medium">Ngày phát hành:</span> {movie.releaseDate}
                </div>
                <div>
                  <span className="font-medium">Thời lượng:</span> {movie.duration}
                </div>
                {movie.upcoming && (
                  <div className="inline-block px-3 py-1 bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300 rounded-full text-sm">
                    Phim sắp chiếu
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Showtimes Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Lịch chiếu phim</h3>
            
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
                      <CalendarIcon size={16} />
                      <span>{new Date(date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}</span>
                    </button>
                  ))}
                </div>
                
                {/* Showtimes by Theater */}
                <div className="space-y-6">
                  {Object.entries(showtimesByTheater).map(([theaterId, showtimes]) => {
                    const theater = theaters.find(t => t.id === parseInt(theaterId));
                    if (!theater) return null;
                    
                    return (
                      <div key={theaterId} className="glass-card p-4 rounded-xl">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-purple-100/70 dark:bg-purple-900/30">
                            <MapPin size={20} className="text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{theater.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{theater.location}</p>
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
                <p className="text-gray-500 dark:text-gray-400">Không có suất chiếu nào cho phim này</p>
              </div>
            )}
          </div>
          
          {movie.trailerUrl && (
            <div>
              <h3 className="text-lg font-medium mb-2">Trailer</h3>
              <a 
                href={movie.trailerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                <Video size={18} />
                <span>Xem trailer</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail; 