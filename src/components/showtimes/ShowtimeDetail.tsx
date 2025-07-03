import React, { useState, useEffect } from 'react';
import { X, Film, Building2, Calendar, Clock, Ticket } from 'lucide-react';
import type { Showtime } from '../../types/global-types';
import ServiceApi from '../../services/api';

interface ShowtimeDetailProps {
  showtimeId: number;
  onClose: () => void;
}

const ShowtimeDetail: React.FC<ShowtimeDetailProps> = ({ showtimeId, onClose }) => {
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movie, setMovie] = useState<any>(null);
  const [theater, setTheater] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowtimeDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch showtime details
        const showtimeRes = await ServiceApi.get(`/showtimes/${showtimeId}`);
        const showtimeData = showtimeRes.data.data;
        setShowtime(showtimeData);

        // Fetch related movie and theater details
        const [movieRes, theaterRes] = await Promise.all([
          ServiceApi.get(`/movies/${showtimeData.movieId}`),
          ServiceApi.get(`/theaters/${showtimeData.theaterId}`)
        ]);

        setMovie(movieRes.data.data);
        setTheater(theaterRes.data.data);
      } catch (error) {
        console.error('Error fetching showtime details:', error);
        setError('Không thể tải thông tin suất chiếu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimeDetails();
  }, [showtimeId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
            <span>Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{marginTop: '0px'}}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md">
          <div className="text-center">
            <div className="text-error-500 mb-3">
              <X size={40} className="mx-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!showtime || !movie || !theater) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chi tiết suất chiếu</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Movie Info */}
          <div className="flex gap-4 mb-6">
            {movie.posterPath ? (
              <img 
                src={movie.posterPath} 
                alt={movie.title} 
                className="w-24 h-36 object-cover rounded-lg"
              />
            ) : (
              <div className="w-24 h-36 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Film size={24} className="text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <p>Thời lượng: {movie.duration} phút</p>
                <p>Đạo diễn: {movie.director}</p>
                <p>Thể loại: {movie.genres?.map((g: any) => g.name).join(', ') || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </div>

          {/* Showtime Details */}
          <div className="space-y-4">
            {/* Theater */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Building2 size={20} className="text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rạp chiếu</p>
                <p className="font-medium">{theater.name}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Calendar size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày chiếu</p>
                <p className="font-medium">
                  {new Date(showtime.date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Clock size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Giờ chiếu</p>
                <p className="font-medium">{showtime.time}</p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Ticket size={20} className="text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Giá vé</p>
                <p className="font-medium">{showtime.price.toLocaleString('vi-VN')} đ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowtimeDetail; 