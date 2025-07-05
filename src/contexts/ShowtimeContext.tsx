import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { Showtime } from "../types/global-types";
import ServiceApi from "../services/api";

interface ShowtimeContextType {
  showtimes: Showtime[];
  loading: boolean;
  getShowtimesByMovie: (movieId: number) => Showtime[];
  getShowtimesByTheater: (theaterId: number) => Showtime[];
  getShowtimesByDate: (date: string) => Showtime[];
  getMoviesByTheater: (theaterId: number) => number[];
  getTheatersByMovie: (movieId: number) => number[];
  getUniqueShowtimeDates: () => string[];
  addShowtime: (showtime: Omit<Showtime, 'id'>) => Promise<void>;
  updateShowtime: (id: number, showtime: Omit<Showtime, 'id'>) => Promise<void>;
  deleteShowtime: (id: number) => Promise<void>;
  getShowtime: (id: number) => Showtime | undefined;
  fetchShowtimes: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  const fetchShowtimes = async () => {
    try {
      setLoading(true);
      const response = await ServiceApi.get('/show-times');
      setShowtimes(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowtimes();
  }, []);

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
    return [...new Set(theaterShowtimes.map(showtime => showtime.movieId))];
  };

  const getTheatersByMovie = (movieId: number) => {
    const movieShowtimes = getShowtimesByMovie(movieId);
    return [...new Set(movieShowtimes.map(showtime => showtime.theaterId))];
  };

  const getUniqueShowtimeDates = () => {
    return [...new Set(showtimes.map(showtime => showtime.date))].sort();
  };

  const addShowtime = async (showtime: Omit<Showtime, 'id'>) => {
    try {
      await ServiceApi.post('/show-times', showtime);
      await fetchShowtimes(); // Refresh list after adding
    } catch (error) {
      console.error('Error adding showtime:', error);
      throw error;
    }
  };

  const updateShowtime = async (id: number, updatedShowtime: Omit<Showtime, 'id'>) => {
    try {
      await ServiceApi.patch(`/show-times/${id}`, updatedShowtime);
      await fetchShowtimes(); // Refresh list after updating
    } catch (error) {
      console.error('Error updating showtime:', error);
      throw error;
    }
  };

  const deleteShowtime = async (id: number) => {
    try {
      await ServiceApi.delete(`/show-times/${id}`);
      await fetchShowtimes(); // Refresh list after deleting
    } catch (error) {
      console.error('Error deleting showtime:', error);
      throw error;
    }
  };

  const getShowtime = (id: number) => {
    return showtimes.find(showtime => showtime.id === id);
  };

  return (
    <ShowtimeContext.Provider value={{ 
      showtimes,
      loading,
      getShowtimesByMovie,
      getShowtimesByTheater,
      getShowtimesByDate,
      getMoviesByTheater,
      getTheatersByMovie,
      getUniqueShowtimeDates,
      addShowtime,
      updateShowtime,
      deleteShowtime,
      getShowtime,
      fetchShowtimes
    }}>
      {children}
    </ShowtimeContext.Provider>
  );
}; 