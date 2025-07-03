export interface Actor {
    id: number;
    name: string;
    photo?: string;
    createdAt: string;
    updatedAt: string;
  }

export interface Genre {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MovieGenre {
  id: number;
  movieId: number;
  genreId: number;
  genre: Genre;
  createdAt?: string;
  updatedAt?: string;
}

export interface Movie {
  id: number;
  title: string;
  posterPath: string;
  backdropPath: string;
  genres: MovieGenre[];
  rating: number;
  synopsis: string;
  duration: string;
  director: string;
  writer?: string;
  country?: string;
  language?: string;
  actors: string;
  cast: number[];
  releaseDate: string;
  trailerUrl: string;
  upcoming: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Showtime {
  id: number;
  movieId: number;
  theaterId: number;
  date: string;
  time: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Theater {
  id: number;
  name: string;
  location: string;
}

export interface ShowtimeInput {
  theaterId: number;
  date: string;
  time: string;
  price: number;
}