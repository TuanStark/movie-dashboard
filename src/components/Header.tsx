import React from 'react';
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  darkMode, 
  setDarkMode 
}) => {
  return (
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
  );
};

export default Header; 