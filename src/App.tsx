import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import Users from "./pages/Users";
import Bookings from "./pages/Bookings";
import Theaters from "./pages/Theaters";
import Showtimes from "./pages/Showtimes";
import Articles from "./pages/Articles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import { MovieProvider } from "./contexts/MovieContext";
import { UserProvider } from "./contexts/UserContext";
import { ArticleProvider } from "./contexts/ArticleContext";
import { TheaterProvider } from "./contexts/TheaterContext";
import { BookingProvider } from "./contexts/BookingContext";
import { ShowtimeProvider } from "./contexts/ShowtimeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <MovieProvider>
          <UserProvider>
            <ArticleProvider>
              <TheaterProvider>
                <BookingProvider>
                  <ShowtimeProvider>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      
                      {/* Protected routes */}
                      <Route path="/" element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }>
                        <Route index element={<Dashboard />} />
                        <Route path="movies" element={<Movies />} />
                        <Route path="users" element={
                          <ProtectedRoute requiredRole="ADMIN">
                            <Users />
                          </ProtectedRoute>
                        } />
                        <Route path="bookings" element={<Bookings />} />
                        <Route path="theaters" element={<Theaters />} />
                        <Route path="showtimes" element={<Showtimes />} />
                        <Route path="articles" element={<Articles />} />
                      </Route>
                    </Routes>
                  </ShowtimeProvider>
                </BookingProvider>
              </TheaterProvider>
            </ArticleProvider>
          </UserProvider>
        </MovieProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 