import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, MapPin, Calendar, BookOpen } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationLinks = [
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      description: 'View and manage your profile'
    },
    {
      name: 'Tours',
      path: '/tours',
      icon: MapPin,
      description: 'Browse available tours'
    },
    {
      name: 'Book Tour',
      path: '/book-tour',
      icon: Calendar,
      description: 'Book a new tour'
    },
    {
      name: 'Bookings Info',
      path: '/bookings',
      icon: BookOpen,
      description: 'View your booking history'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className=\"bg-gray-800 shadow-lg\">
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
        <div className=\"flex justify-between items-center h-16\">
          {/* Logo/Brand */}
          <div className=\"flex-shrink-0\">
            <Link 
              to=\"/\" 
              className=\"text-white text-xl font-bold hover:text-gray-300 transition-colors duration-200\"
            >
              Tour App
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className=\"hidden md:block\">
            <div className=\"ml-10 flex items-baseline space-x-4\">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
   isActive(link.path)
   ? 'bg-gray-900 text-white'
   : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    title={link.description}
                  >
                    <IconComponent className=\"h-4 w-4 mr-2\" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className=\"md:hidden\">
            <button
              onClick={toggleMobileMenu}
              className=\"inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white\"
              aria-expanded={isMobileMenuOpen}
              aria-controls=\"mobile-menu\"
            >
              <span className=\"sr-only\">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className=\"block h-6 w-6\" aria-hidden=\"true\" />
              ) : (
                <Menu className=\"block h-6 w-6\" aria-hidden=\"true\" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className=\"md:hidden\" id=\"mobile-menu\">
          <div className=\"px-2 pt-2 pb-3 space-y-1 sm:px-3\">
            {navigationLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive(link.path)
   ? 'bg-gray-900 text-white'
   : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={link.description}
                >
                  <IconComponent className=\"h-5 w-5 mr-3\" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;