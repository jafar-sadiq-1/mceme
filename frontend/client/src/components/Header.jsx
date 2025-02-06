import React, { useState } from 'react';
import { UserIcon } from '@heroicons/react/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/th.jpg'; // Import the logo image

// You can add this link tag in the `public/index.html` file to load Poppins font
// <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  // If on '/' route, do not render the header
  if (location.pathname === '/') {
    return null;
  }

  // Toggle dropdown visibility on click
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Handle navigation for dropdown items
  const handleNavigation = (path) => {
    navigate(path);
    setDropdownVisible(false);
  };

  return (
    <header className="bg-gradient-to-r from-teal-500 to-violet-700 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* EME Journal Title with logo */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <img
            src={logo} 
            alt="Logo"
            className="h-14 w-14 rounded-full transform transition duration-300 hover:scale-110"
          />
          <div className="text-3xl font-serif font-bold text-lightyellow">EME Journal</div>
        </div>

        {/* Profile Icon and Dropdown */}
        <div className="relative ml-auto group">
          <div
            className="flex items-center p-2 border-2 border-white rounded-full hover:bg-blue hover:text-teal-600 transition duration-200 cursor-pointer transform hover:scale-110"
            onClick={toggleDropdown}
            role="button"
            aria-haspopup="true"
            aria-expanded={dropdownVisible}
          >
            <UserIcon className="h-8 w-8 text-white" />
          </div>

          {/* Dropdown menu */}
          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-teal-700 rounded-lg shadow-lg transition duration-200 transform opacity-0 group-hover:opacity-100 font-serif">
              <ul>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleNavigation('/change-password')}
                >
                  Change Password
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleNavigation('/users-requests')}
                >
                  Users And Requests
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleNavigation('/approvals')}
                >
                  Approvals
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleNavigation('/')}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
