import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Film, 
  Users as UsersIcon, 
  Ticket, 
  Building2, 
  Newspaper, 
  X,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Calendar,
  List
} from 'lucide-react';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => {
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
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <>
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
          <NavLink to="/movies" icon={<Film size={18} />} label="Quản lí phim" />
          
          <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium px-4 py-2 mt-4">
            Quản lý
          </div>
          <NavLink to="/users" icon={<UsersIcon size={18} />} label="Quản lí tài khoản" />
          <NavLink to="/bookings" icon={<Ticket size={18} />} label="Quản lí vé" />
          <NavLink to="/theaters" icon={<Building2 size={18} />} label="Quản lí rạp" />
          <NavLink to="/showtimes" icon={<Calendar size={18} />} label="Quản lí suất chiếu" />
          <NavLink to="/genres" icon={<List size={18} />} label="Quản lí thể loại" />
          <NavLink to="/actors" icon={<User size={18} />} label="Quản lí diễn viên" />
          <NavLink to="/articles" icon={<Newspaper size={18} />} label="Quản lí bài viết" />
        </nav>
        
        <div className="p-4 border-t border-gray-200/80 dark:border-gray-700/80">
          <div className="relative">
            <button 
              className="flex items-center gap-3 p-3 rounded-xl w-full hover:bg-gray-100/80 dark:hover:bg-gray-750/70 transition-all"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary-500/30 ring-offset-1 ring-offset-white dark:ring-offset-gray-800">
                <img 
                  src={user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} 
                  alt={user?.name || "User"} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left flex-1">
                <div className="font-medium">{user?.name || "User"}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email || "user@example.com"}</div>
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
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-error-50 dark:hover:bg-error-900/20 text-error-600 dark:text-error-400 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 