import React, { useState } from 'react';
import { UserIcon } from '@heroicons/react/solid';
import { useNavigate, useLocation } from 'react-router-dom';

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
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* EME Journal Title */}
        <div className="text-3xl font-bold">EME Journal</div>

        {/* Profile Icon and Dropdown */}
        <div className="relative ml-auto">
          <div
            className="flex items-center p-2 border-2 border-white rounded-full hover:bg-white hover:text-blue-600 transition duration-200 cursor-pointer"
            onClick={toggleDropdown}
          >
            <UserIcon className="h-8 w-8 text-black" />
          </div>

          {/* Dropdown menu */}
          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-blue-600 rounded-lg shadow-md">
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
                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleNavigation('/')}>
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
