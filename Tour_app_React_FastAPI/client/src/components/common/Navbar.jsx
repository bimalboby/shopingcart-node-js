import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationLinks = [
    { name: 'Profile', href: '/profile', current: location.pathname === '/profile' },
    { name: 'Tours', href: '/tours', current: location.pathname === '/tours' },
    { name: 'Book Tour', href: '/book-tour', current: location.pathname === '/book-tour' },
    { name: 'Bookings Info', href: '/bookings-info', current: location.pathname === '/bookings-info' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className=\"bg-gray-800 shadow-lg\">
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
        <div className=\"flex items-center justify-between h-16\">
          <div className=\"flex items-center\">
            <div className=\"flex-shrink-0\">
              <Link to=\"/\" className=\"text-white text-xl font-bold\">
                Tour App
              </Link>
            </div>
            <div className=\"hidden md:block\">
              <div className=\"ml-10 flex items-baseline space-x-4\">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
   isActive(link.href)
   ? 'bg-emerald-600 text-white'
   : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* User Profile Dropdown */}
          <div className=\"hidden md:block\">
            <div className=\"ml-4 flex items-center md:ml-6\">
              <button
                type=\"button\"
                className=\"bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white\"
              >
                <span className=\"sr-only\">View notifications</span>
                <UserCircleIcon className=\"h-6 w-6\" aria-hidden=\"true\" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className=\"-mr-2 flex md:hidden\">
            <button
              type=\"button\"
              className=\"bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white\"
              aria-controls=\"mobile-menu\"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className=\"sr-only\">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className=\"block h-6 w-6\" aria-hidden=\"true\" />
              ) : (
                <Bars3Icon className=\"block h-6 w-6\" aria-hidden=\"true\" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className=\"md:hidden\" id=\"mobile-menu\">
          <div className=\"px-2 pt-2 pb-3 space-y-1 sm:px-3\">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                aria-current={isActive(link.href) ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className=\"pt-4 pb-3 border-t border-gray-700\">
            <div className=\"flex items-center px-5\">
              <div className=\"flex-shrink-0\">
                <UserCircleIcon className=\"h-8 w-8 text-gray-400\" />
              </div>
              <div className=\"ml-3\">
                <div className=\"text-base font-medium text-white\">User Profile</div>
                <div className=\"text-sm font-medium text-gray-400\">user@example.com</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;