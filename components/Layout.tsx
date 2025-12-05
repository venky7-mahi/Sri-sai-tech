import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Cpu, Phone, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900 tracking-tight">
                  SRI SAI <span className="text-blue-600">TECH</span>
                </span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link 
                to="/" 
                className={`${isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'} px-3 py-2 rounded-md text-sm transition-colors`}
              >
                Home
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/register" 
                    className={`${isActive('/register') ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
                  >
                    Register Customer
                  </Link>
                  <Link 
                    to="/admin" 
                    className={`${isActive('/admin') ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'} px-3 py-2 rounded-md text-sm transition-colors`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                 <Link 
                    to="/login" 
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Admin Login
                  </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Home
              </Link>

              {isAuthenticated && (
                <>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Register Customer
                  </Link>
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              )}

              {!isAuthenticated && (
                 <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Admin Login
                  </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
             <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Cpu className="h-6 w-6 text-blue-400" />
                <span className="font-bold text-lg tracking-tight">
                  SRI SAI <span className="text-blue-400">TECH</span>
                </span>
             </div>
             <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-gray-300 text-sm">
                <div className="flex items-center gap-2">
                   <Phone className="h-4 w-4" />
                   <span>+91 98765 43210</span>
                </div>
                <span>© {new Date().getFullYear()} Sri Sai Technologies. All rights reserved.</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;