import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import Users from "./pages/Users";
import Bookings from "./pages/Bookings";
import Theaters from "./pages/Theaters";
import Articles from "./pages/Articles";
import { MovieProvider } from "./contexts/MovieContext";
import { UserProvider } from "./contexts/UserContext";
import { ArticleProvider } from "./contexts/ArticleContext";
import { TheaterProvider } from "./contexts/TheaterContext";
import { BookingProvider } from "./contexts/BookingContext";
import { ShowtimeProvider } from "./contexts/ShowtimeContext";
import { 
  LayoutDashboard, 
  Film, 
  Users as UsersIcon, 
  Ticket, 
  Building2, 
  Newspaper, 
  Menu, 
  X,
  Bell,
  Search,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  User
} from "lucide-react";

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function NavLink({ to, icon, label }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== "/" && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? "bg-gradient-to-r from-primary-500/20 to-primary-600/10 text-primary-600 dark:text-primary-400 font-medium shadow-sm" 
          : "hover:bg-gray-100/80 dark:hover:bg-gray-800/50"
      }`}
    >
      <div className={`${isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"} transition-colors`}>
        {icon}
      </div>
      <span className="transition-all">{label}</span>
    </Link>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Toggle dark mode
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <MovieProvider>
        <UserProvider>
          <ArticleProvider>
            <TheaterProvider>
              <BookingProvider>
                <ShowtimeProvider>
                  <div className={`flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
                    {/* Mobile sidebar backdrop */}
                    {sidebarOpen && (
                      <div 
                        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-10 animate-fadeIn"
                        onClick={() => setSidebarOpen(false)}
                      />
                    )}
                    
                    {/* Sidebar */}
                    <aside 
                      className={`fixed md:sticky top-0 z-20 h-screen transition-all duration-300 ease-in-out ${
                        sidebarOpen ? "left-0" : "-left-72"
                      } w-72 bg-white/80 dark:bg-gray-800/90 backdrop-blur-md border-r border-gray-200/80 dark:border-gray-700/80 flex flex-col shadow-lg shadow-gray-200/50 dark:shadow-gray-900/30`}
                    >
                      <div className="p-4 border-b border-gray-200/80 dark:border-gray-700/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-primary-500/20">M</div>
                          <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">MovieDash</span>
                        </div>
                        <button 
                          className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <X size={18} />
                        </button>
                      </div>
                      
                      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1.5">
                        <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium px-4 py-2">
                          Tổng quan
                        </div>
                        <NavLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                        <NavLink to="/movies" icon={<Film size={18} />} label="Movies" />
                        
                        <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium px-4 py-2 mt-4">
                          Quản lý
                        </div>
                        <NavLink to="/users" icon={<UsersIcon size={18} />} label="Users" />
                        <NavLink to="/bookings" icon={<Ticket size={18} />} label="Bookings" />
                        <NavLink to="/theaters" icon={<Building2 size={18} />} label="Theaters" />
                        <NavLink to="/articles" icon={<Newspaper size={18} />} label="Articles" />
                      </nav>
                      
                      <div className="p-4 border-t border-gray-200/80 dark:border-gray-700/80">
                        <div className="relative">
                          <button 
                            className="flex items-center gap-3 p-3 rounded-xl w-full hover:bg-gray-100/80 dark:hover:bg-gray-750/70 transition-all"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary-500/30 ring-offset-1 ring-offset-white dark:ring-offset-gray-800">
                              <img 
                                src="https://randomuser.me/api/portraits/men/32.jpg" 
                                alt="User" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-medium">Admin User</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</div>
                            </div>
                            <ChevronDown 
                              size={16} 
                              className={`text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} 
                            />
                          </button>
                          
                          {userMenuOpen && (
                            <div className="absolute bottom-full left-0 w-full mb-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/80 dark:border-gray-700/80 py-2 animate-fadeIn">
                              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-gray-100/80 dark:hover:bg-gray-750/70 transition-colors">
                                <User size={16} className="text-gray-500" />
                                <span>Hồ sơ</span>
                              </button>
                              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-gray-100/80 dark:hover:bg-gray-750/70 transition-colors">
                                <Settings size={16} className="text-gray-500" />
                                <span>Cài đặt</span>
                              </button>
                              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-gray-100/80 dark:hover:bg-gray-750/70 transition-colors">
                                <HelpCircle size={16} className="text-gray-500" />
                                <span>Trợ giúp</span>
                              </button>
                              <div className="my-1.5 border-t border-gray-200 dark:border-gray-700/80"></div>
                              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-error-50 dark:hover:bg-error-900/20 text-error-600 dark:text-error-400 transition-colors">
                                <LogOut size={16} />
                                <span>Đăng xuất</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </aside>
                    
                    <div className="flex-1 flex flex-col">
                      {/* Header */}
                      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-700/80 h-16 flex items-center px-4 gap-4 sticky top-0 z-10 shadow-sm">
                        <button 
                          className="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/70 transition-colors"
                          onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                          <Menu size={20} />
                        </button>
                        
                        <div className="relative flex-1 max-w-md">
                          <input 
                            type="text" 
                            placeholder="Tìm kiếm..." 
                            className="w-full py-2 pl-10 pr-4 rounded-xl bg-gray-50/80 dark:bg-gray-700/70 border border-gray-200/80 dark:border-gray-600/80 focus:ring-2 focus:ring-primary-500/70 focus:border-transparent transition-all"
                          />
                          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            className="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/70 relative transition-colors"
                          >
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
                          </button>
                          
                          <button 
                            className="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/70 transition-colors"
                            onClick={() => setDarkMode(!darkMode)}
                          >
                            {darkMode ? 
                              <Sun size={20} className="text-yellow-500" /> : 
                              <Moon size={20} className="text-gray-700" />
                            }
                          </button>
                        </div>
                      </header>
                      
                      {/* Main content */}
                      <main className="flex-1 overflow-y-auto animate-fadeIn p-6">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/movies" element={<Movies />} />
                          <Route path="/users" element={<Users />} />
                          <Route path="/bookings" element={<Bookings />} />
                          <Route path="/theaters" element={<Theaters />} />
                          <Route path="/articles" element={<Articles />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </ShowtimeProvider>
              </BookingProvider>
            </TheaterProvider>
          </ArticleProvider>
        </UserProvider>
      </MovieProvider>
    </Router>
  );
}

export default App; 