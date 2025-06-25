import React from 'react';
import { X, Edit, Trash, Calendar, Clock, DollarSign, Film, Building2 } from 'lucide-react';
import type { Showtime } from '../../data/mock-data';
import { useMovies } from '../../contexts/MovieContext';
import { useTheaters } from '../../contexts/TheaterContext';

interface ShowtimeDetailProps {
  showtime: Showtime;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ShowtimeDetail: React.FC<ShowtimeDetailProps> = ({ showtime, onClose, onEdit, onDelete }) => {
  const { movies } = useMovies();
  const { theaters } = useTheaters();
  
  const movie = movies.find(m => m.id === showtime.movieId);
  const theater = theaters.find(t => t.id === showtime.theaterId);
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chi tiết suất chiếu</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Movie Info */}
          {movie && (
            <div className="flex gap-4 mb-6">
              <div className="w-24 h-36 flex-shrink-0">
                {movie.posterPath ? (
                  <img 
                    src={movie.posterPath} 
                    alt={movie.title} 
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Film size={24} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">{movie.title}</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {movie.genres.map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-100/80 dark:bg-gray-700/80 rounded-full text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span className="font-medium">Thời lượng:</span> {movie.duration}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Đạo diễn:</span> {movie.director}
                </p>
              </div>
            </div>
          )}
          
          {/* Theater Info */}
          {theater && (
            <div className="glass-card rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={18} className="text-purple-500" />
                <h3 className="font-medium">{theater.name}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 pl-6">
                {theater.location}
              </p>
            </div>
          )}
          
          {/* Showtime Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-blue-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày chiếu</p>
              </div>
              <p className="font-medium">
                {new Date(showtime.date).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={18} className="text-green-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Giờ chiếu</p>
              </div>
              <p className="font-medium">{showtime.time}</p>
            </div>
            
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-amber-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Giá vé</p>
              </div>
              <p className="font-medium">{showtime.price.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="glass-card rounded-xl p-4 mb-4">
            <h4 className="font-medium mb-2">Thông tin bổ sung</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Mã suất chiếu: <span className="font-mono">{showtime.id}</span>
            </p>
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

export default ShowtimeDetail; 