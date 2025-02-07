import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from "jwt-decode";
import { UserIcon } from '@heroicons/react/solid';
import { Bell } from 'lucide-react'; // Import Bell icon
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from "framer-motion"; // Import Framer Motion
import logo from '../assets/th.jpg'; // Logo image

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState('');
  const [notificationCount, setNotificationCount] = useState(5); // Example notification count
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null); // Reference for dropdown

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
    <header className="bg-gradient-to-r from-teal-500 to-violet-700 text-white p-4 shadow-lg ">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-serif">
        
        {/* Left Section: Logo, Waving Hand & Greeting */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-14 w-14 rounded-full transform transition duration-300 hover:scale-110" />
          
          {/* Waving Hand with Animation */}
          <motion.span 
            className="text-2xl"
            animate={{ rotate: [0, 25, 0, -25, 0] }} // Rotates like a real wave
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          >
            👋
          </motion.span>
          <span className="text-white font-bold text-2xl"style={{ fontFamily: 'Times New Roman, serif' }}>{user ? `Hi ${user} !` : "Not Logged In"}</span>
        </div>
        {/* Centered Title - Clickable to Navigate to Home */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-serif font-bold text-lightyellow cursor-pointer"
          onClick={() => navigate('/home')} // Navigate to home on click
        >
          EME Journal
        </div>

        {/* Right Section: Bell Icon & Profile Dropdown */}
        <div className="relative flex items-center space-x-4">
          
          {/* Bell Icon */}
          <div
            className="relative p-2 rounded-full hover:text-teal-600 transition duration-200 cursor-pointer transform hover:scale-110"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-8 w-8 text-white transform rotate-12" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">
                {notificationCount}
              </span>
            )}
          </div>

          {/* Profile Icon & Dropdown */}
          <div className="relative" ref={dropdownRef} onMouseLeave={() => setDropdownVisible(false)} onMouseEnter={() => setDropdownVisible(true)}>
            {/* Profile Icon */}
            <div
              className="flex items-center p-2 border-2 border-white rounded-full transition-all duration-300 hover:text-teal-600 cursor-pointer hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 mt-2 mb-2"
              onClick={toggleDropdown}
              role="button"
              aria-haspopup="true"
              aria-expanded={dropdownVisible}
            >
              <UserIcon className="h-8 w-8 text-white transition-all duration-300" />
            </div>

            {/* Dropdown Menu */}
            {dropdownVisible && (
              <div className="absolute right-0 w-48 bg-white text-teal-700 rounded-lg shadow-md" onMouseEnter={() => setDropdownVisible(true)}>
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleNavigation('/change-password')}> Change Password </li>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleNavigation('/users-requests')}> Users And Requests </li>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleNavigation('/approvals')}> Approvals </li>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => { localStorage.clear(); window.location.href = '/'; }}> Logout </li>
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
