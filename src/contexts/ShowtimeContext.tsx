import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { showtimes as initialShowtimes, movies, theaters } from "../data/mock-data";
import type { Showtime, Movie, Theater } from "../data/mock-data";
import ServiceApi from "../services/api";

interface ShowtimeContextType {
  showtimes: Showtime[];
  getShowtimesByMovie: (movieId: number) => Showtime[];
  getShowtimesByTheater: (theaterId: number) => Showtime[];
  getShowtimesByDate: (date: string) => Showtime[];
  getMoviesByTheater: (theaterId: number) => Movie[];
  getTheatersByMovie: (movieId: number) => Theater[];
  getUniqueShowtimeDates: () => string[];
  addShowtime: (showtime: Omit<Showtime, 'id'>) => void;
  updateShowtime: (id: number, showtime: Omit<Showtime, 'id'>) => void;
  deleteShowtime: (id: number) => void;
  getShowtime: (id: number) => Showtime | undefined;
}

const ShowtimeContext = createContext<ShowtimeContextType | undefined>(undefined);

export const useShowtimes = () => {
  const context = useContext(ShowtimeContext);
  if (!context) {
    throw new Error("useShowtimes must be used within a ShowtimeProvider");
  }
  return context;
};

interface ShowtimeProviderProps {
  children: ReactNode;
}

export const ShowtimeProvider: React.FC<ShowtimeProviderProps> = ({ children }) => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);

  useEffect(() => {
    // Load showtimes from localStorage or use initial data
    const savedShowtimes = localStorage.getItem('showtimes');
    if (savedShowtimes) {
      setShowtimes(JSON.parse(savedShowtimes));
    } else {
      setShowtimes(initialShowtimes);
    }
  }, []);

  // Save to localStorage whenever showtimes change
  useEffect(() => {
    if (showtimes.length > 0) {
      localStorage.setItem('showtimes', JSON.stringify(showtimes));
    }
  }, [showtimes]);

  const getShowtimesByMovie = (movieId: number) => {
    return showtimes.filter(showtime => showtime.movieId === movieId);
  };

  const getShowtimesByTheater = (theaterId: number) => {
    return showtimes.filter(showtime => showtime.theaterId === theaterId);
  };

  const getShowtimesByDate = (date: string) => {
    return showtimes.filter(showtime => showtime.date === date);
  };

  const getMoviesByTheater = (theaterId: number) => {
    const theaterShowtimes = getShowtimesByTheater(theaterId);
    const movieIds = [...new Set(theaterShowtimes.map(showtime => showtime.movieId))];
    return movies.filter(movie => movieIds.includes(movie.id));
  };

  const getTheatersByMovie = (movieId: number) => {
    const movieShowtimes = getShowtimesByMovie(movieId);
    const theaterIds = [...new Set(movieShowtimes.map(showtime => showtime.theaterId))];
    return theaters.filter(theater => theaterIds.includes(theater.id));
  };

  const getUniqueShowtimeDates = () => {
    return [...new Set(showtimes.map(showtime => showtime.date))].sort();
  };

  const addShowtime = (showtime: Omit<Showtime, 'id'>) => {
    // Generate a new ID (highest ID + 1)
    const newId = showtimes.length > 0 
      ? Math.max(...showtimes.map(s => s.id)) + 1 
      : 1;
    
    const newShowtime = {
      ...showtime,
      id: newId
    };
    
    setShowtimes([...showtimes, newShowtime]);

    // API call
    try {
      ServiceApi.post('/showtimes', showtime);
    } catch (error) {
      console.error('Error adding showtime:', error);
    }
  };

  const updateShowtime = (id: number, updatedShowtime: Omit<Showtime, 'id'>) => {
    setShowtimes(showtimes.map(showtime => 
      showtime.id === id ? { ...updatedShowtime, id } : showtime
    ));

    // API call
    try {
      ServiceApi.put(`/showtimes/${id}`, updatedShowtime);
    } catch (error) {
      console.error('Error updating showtime:', error);
    }
  };

  const deleteShowtime = (id: number) => {
    setShowtimes(showtimes.filter(showtime => showtime.id !== id));

    // API call
    try {
      ServiceApi.delete(`/showtimes/${id}`);
    } catch (error) {
      console.error('Error deleting showtime:', error);
    }
  };

  const getShowtime = (id: number) => {
    return showtimes.find(showtime => showtime.id === id);
  };

  return (
    <ShowtimeContext.Provider value={{ 
      showtimes,
      getShowtimesByMovie,
      getShowtimesByTheater,
      getShowtimesByDate,
      getMoviesByTheater,
      getTheatersByMovie,
      getUniqueShowtimeDates,
      addShowtime,
      updateShowtime,
      deleteShowtime,
      getShowtime
    }}>
      {children}
    </ShowtimeContext.Provider>
  );
}; 