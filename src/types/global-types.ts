export interface Actor {
    id: number;
    name: string;
    photo?: string;
    // createdAt: string;
    updatedAt: string;
}

export interface Cast {
  id: number;
  actorId: number;
  MoviId: number;
  // createdAt: string;
  updatedAt: string;
  actor: Actor;
  movie: Movie;
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
  casts: Cast[];
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
  movie: Movie;
  theater: Theater;
}

export interface Users {
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
  longitude: number;
  latitude: number;
  logo: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShowtimeInput {
  theaterId: number;
  date: string;
  time: string;
  price: number;
}

export interface Seats {
  id: number;
  bookingId: number;
  seatId: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  seat: Seat
}

export interface Seat {
  id: number;
  theaterId: number;
  row: string;
  number: number;
  type: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Bookings {
  id: number;
  bookingId: string;
  userId: number;
  movieId: number;
  bookingCode: string;
  bookingDate: string;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  images: string;
  createdAt?: string;
  updatedAt?: string;
  user: Users;
  seats: Seats[];
  showtime: Showtime;
}

export interface Categories{
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Articles{
  id: number;
  title: string;
  excerpt: string;
  content: string;
  categoryId: number;
  readTime: number;
  imagePath: string;
  date:string;
  authorId: string;
  author: Users;
  category: Categories
  createdAt?: string;
  updatedAt?: string;
}

export interface Meta{
  total: number;
  pageNumber: number;
  limitNumber: number;
  totalPages: number;
}

export interface Review {
  id: number;
  userId: number;
  movieId: number;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
  user: Users;
  movie: Movie;
}