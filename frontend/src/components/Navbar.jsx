import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const isLoggedIn = !!user;

  useEffect(() => {
    if (!loading) {
      setIsInitialized(true);
    }
  }, [loading]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-icon-container')) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    localStorage.removeItem('previewImage');
    localStorage.removeItem('memeEditorState');
    navigate('/');
  };

  const navLinks = (isMobile = false) => (
    <>
      {[
        { name: 'Home', path: '/', id: 'home', icon: '🏠' },
        { name: 'Create', path: '/create', id: 'create', icon: '✨' },
        { name: 'About', path: '/about', id: 'about', icon: '💫' },
      ].map((item) => (
        <Link
          key={item.id}
          to={item.path}
          onClick={() => {
            setActiveItem(item.id);
            if (isMobile) setIsMobileMenuOpen(false);
          }}
          className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 group ${
            activeItem === item.id
              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white shadow-lg shadow-cyan-500/10 border border-cyan-500/30'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="text-base group-hover:scale-110 transition-transform duration-200">
            {item.icon}
          </span>
          <span>{item.name}</span>
          {activeItem === item.id && (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-xl animate-pulse"></div>
          )}
        </Link>
      ))}
    </>
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/20 backdrop-blur-xl border-b border-white/10'
            : 'bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-cyan-900/30 backdrop-blur-lg'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <Link
              to="/"
              className="group flex items-center space-x-3"
              onClick={() => setActiveItem('home')}
            >
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-purple-500/25">
                  <span className="text-2xl font-black text-white">MM</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  MemeGen
                </span>
                <span className="text-xs text-gray-400 font-medium -mt-1">Create & Share</span>
              </div>
            </Link>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white focus:outline-none text-2xl"
              >
                {isMobileMenuOpen ? '✖️' : '☰'}
              </button>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
              {navLinks()}
            </div>

            {/* Profile / Auth Buttons (Desktop) */}
            <div className="hidden md:flex items-center space-x-4 relative">
              {!loading && isInitialized && !isLoggedIn && (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Signup
                  </button>
                </>
              )}

              {(loading || !isInitialized) && (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              )}

              {!loading && isInitialized && isLoggedIn && (
                <div
                  className="relative ml-4 cursor-pointer profile-icon-container"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center text-white font-bold text-lg select-none shadow-lg">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-black/80 backdrop-blur-md rounded-lg shadow-lg z-50">
                      <button
                        className="block w-full text-left px-4 py-2 text-white hover:bg-purple-600 rounded-md"
                        onClick={() => {
                          setShowProfileDropdown(false);
                          navigate('/dashboard');
                        }}
                      >
                        Profile
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-white hover:bg-purple-600 rounded-md"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Nav Dropdown */}
{isMobileMenuOpen && (
  <div className="md:hidden mt-4 flex flex-col space-y-2 bg-black/30 p-4 rounded-xl border border-white/10">
    {navLinks(true)}

    {/* If NOT logged in: show Login / Signup */}
    {!loading && isInitialized && !isLoggedIn && (
      <>
        <button
          onClick={() => {
            navigate('/login');
            setIsMobileMenuOpen(false);
          }}
          className="w-full text-left px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          Login
        </button>
        <button
          onClick={() => {
            navigate('/signup');
            setIsMobileMenuOpen(false);
          }}
          className="w-full text-left px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          Signup
        </button>
      </>
    )}

    {/* If logged in: show Profile / Logout */}
    {!loading && isInitialized && isLoggedIn && (
      <>
        <div className="flex items-center gap-3 px-2 py-1 text-white font-semibold">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm truncate">{user.email}</div>
        </div>
        <button
          onClick={() => {
            navigate('/dashboard');
            setIsMobileMenuOpen(false);
          }}
          className="w-full text-left px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600 rounded-md transition-all duration-200"
        >
          Profile
        </button>
        <button
          onClick={() => {
            handleLogout();
            setIsMobileMenuOpen(false);
          }}
          className="w-full text-left px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600 rounded-md transition-all duration-200"
        >
          Logout
        </button>
      </>
    )}
  </div>
)}

        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-24 h-24 bg-gradient-to-r from-pink-500/10 to-yellow-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
