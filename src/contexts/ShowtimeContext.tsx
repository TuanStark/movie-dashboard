import React, { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";
import { showtimes as initialShowtimes, movies, theaters } from "../data/mock-data";
import type { Showtime, Movie, Theater } from "../data/mock-data";

interface ShowtimeContextType {
  showtimes: Showtime[];
  getShowtimesByMovie: (movieId: number) => Showtime[];
  getShowtimesByTheater: (theaterId: number) => Showtime[];
  getShowtimesByDate: (date: string) => Showtime[];
  getMoviesByTheater: (theaterId: number) => Movie[];
  getTheatersByMovie: (movieId: number) => Theater[];
  getUniqueShowtimeDates: () => string[];
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
  const [showtimes] = useState<Showtime[]>(initialShowtimes);

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

  return (
    <ShowtimeContext.Provider value={{ 
      showtimes,
      getShowtimesByMovie,
      getShowtimesByTheater,
      getShowtimesByDate,
      getMoviesByTheater,
      getTheatersByMovie,
      getUniqueShowtimeDates
    }}>
      {children}
    </ShowtimeContext.Provider>
  );
}; 