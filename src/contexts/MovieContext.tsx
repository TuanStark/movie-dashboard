import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { movies as initialMovies, showtimes as initialShowtimes } from '../data/mock-data';
import type { Movie, Showtime } from '../data/mock-data';
import { useShowtimes } from './ShowtimeContext';

interface MovieContextType {
  movies: Movie[];
  addMovie: (movie: Movie, showtimes?: Omit<Showtime, 'id'>[]) => void;
  updateMovie: (id: number, updatedMovie: Movie, showtimes?: Omit<Showtime, 'id'>[]) => void;
  deleteMovie: (id: number) => void;
  getMovie: (id: number) => Movie | undefined;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);

  useEffect(() => {
    // Load movies from localStorage or use initial data
    const savedMovies = localStorage.getItem('movies');
    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
    } else {
      setMovies(initialMovies);
    }
    
    // Load showtimes
    const savedShowtimes = localStorage.getItem('showtimes');
    if (savedShowtimes) {
      setShowtimes(JSON.parse(savedShowtimes));
    } else {
      setShowtimes(initialShowtimes);
    }
  }, []);

  // Save to localStorage whenever movies change
  useEffect(() => {
    if (movies.length > 0) {
      localStorage.setItem('movies', JSON.stringify(movies));
    }
  }, [movies]);
  
  // Save to localStorage whenever showtimes change
  useEffect(() => {
    if (showtimes.length > 0) {
      localStorage.setItem('showtimes', JSON.stringify(showtimes));
    }
  }, [showtimes]);

  const addMovie = (movie: Movie, newShowtimes: Omit<Showtime, 'id'>[] = []) => {
    // Generate a new ID (highest ID + 1)
    const newId = movies.length > 0 
      ? Math.max(...movies.map(m => m.id)) + 1 
      : 1;
    
    const newMovie = {
      ...movie,
      id: newId
    };
    
    setMovies([...movies, newMovie]);
    
    // Thêm suất chiếu mới nếu có
    if (newShowtimes.length > 0) {
      const lastShowtimeId = showtimes.length > 0 
        ? Math.max(...showtimes.map(s => s.id)) 
        : 0;
      
      const showtimesToAdd = newShowtimes.map((showtime, index) => ({
        ...showtime,
        id: lastShowtimeId + index + 1,
        movieId: newId // Gán movieId mới
      }));
      
      setShowtimes([...showtimes, ...showtimesToAdd]);
    }
  };

  const updateMovie = (id: number, updatedMovie: Movie, newShowtimes?: Omit<Showtime, 'id'>[]) => {
    setMovies(movies.map(movie => 
      movie.id === id ? { ...updatedMovie, id } : movie
    ));
    
    // Cập nhật suất chiếu nếu có
    if (newShowtimes && newShowtimes.length > 0) {
      // Xóa các suất chiếu cũ của phim
      const filteredShowtimes = showtimes.filter(showtime => showtime.movieId !== id);
      
      // Thêm các suất chiếu mới
      const lastShowtimeId = filteredShowtimes.length > 0 
        ? Math.max(...filteredShowtimes.map(s => s.id)) 
        : 0;
      
      const showtimesToAdd = newShowtimes.map((showtime, index) => ({
        ...showtime,
        id: lastShowtimeId + index + 1,
        movieId: id
      }));
      
      setShowtimes([...filteredShowtimes, ...showtimesToAdd]);
    }
  };

  const deleteMovie = (id: number) => {
    setMovies(movies.filter(movie => movie.id !== id));
    
    // Xóa các suất chiếu của phim
    setShowtimes(showtimes.filter(showtime => showtime.movieId !== id));
  };

  const getMovie = (id: number) => {
    return movies.find(movie => movie.id === id);
  };

  return (
    <MovieContext.Provider value={{ 
      movies, 
      addMovie, 
      updateMovie, 
      deleteMovie,
      getMovie
    }}>
      {children}
    </MovieContext.Provider>
  );
}; 