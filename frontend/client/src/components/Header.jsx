import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { UserIcon } from '@heroicons/react/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/th.jpg'; // Logo image
import hand from "../assets/hand.png"; // Hand icon

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Do not render the header on the '/' route
  if (location.pathname === '/') {
    return null;
  }

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.username || 'User'); // Ensure a fallback username
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    setDropdownVisible(false);
  };

  return (
    <header className="bg-gradient-to-r from-teal-500 to-violet-700 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-14 w-14 rounded-full transform transition duration-300 hover:scale-110" />
          <div className="text-3xl font-serif font-bold text-lightyellow">EME Journal</div>
        </div>

        {/* Greeting with Hand Icon */}
        <div className="flex items-center text-white font-bold text-2xl">
          {user ? `Hi ${user} !` : "Not Logged In"}
          <img src={hand} alt="hand" className="ml-2 w-6 h-6" />
        </div>

        {/* Profile Icon and Dropdown */}
        <div className="relative ml-auto">
          <div
            className="flex items-center p-2 border-2 border-white rounded-full hover:bg-white hover:text-teal-600 transition duration-200 cursor-pointer"
            onClick={toggleDropdown}
            role="button"
            aria-haspopup="true"
            aria-expanded={dropdownVisible}
          >
            <UserIcon className="h-8 w-8 text-white" />
          </div>

          {/* Dropdown Menu */}
          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-teal-700 rounded-lg shadow-md">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleNavigation('/change-password')}>
                  Change Password
                </li>
                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleNavigation('/users-requests')}>
                  Users And Requests
                </li>
                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleNavigation('/approvals')}>
                  Approvals
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                  }}
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
