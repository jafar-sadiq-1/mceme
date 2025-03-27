import { useState, useEffect, useRef } from 'react';
import { jwtDecode } from "jwt-decode";
import { UserIcon } from '@heroicons/react/solid';
import { Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from "lottie-react";
import wavingHandAnimation from "../assets/hand.json"; // Import JSON file
import logo from '../assets/th.jpg';
import axios from 'axios';

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  if (location.pathname === '/') {
    return null;
  }

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('jwtToken'); // Clear invalid token
        navigate('/'); // Redirect to login
      }
    } else {
      navigate('/'); // Redirect to login if no token
    }
  }, [navigate]);

  useEffect(() => {
    const fetchFDRs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fdr');
        const fdrs = response.data;
        
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        
        const upcomingMaturities = fdrs.filter(fdr => {
          const maturityDate = new Date(fdr.maturityDate);
          return maturityDate <= oneMonthFromNow && maturityDate >= new Date();
        });

        setNotificationCount(upcomingMaturities.length);
      } catch (error) {
        console.error('Error fetching FDRs:', error);
      }
    };

    fetchFDRs();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDropdownVisible(false);
  };

  return (
    <header className="bg-gradient-to-r from-teal-500 to-violet-700 text-white p-4 shadow-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Left Section: Logo & Greeting */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-14 w-14 rounded-full transition hover:scale-110" />
          
          {/* Greeting Text */}
          <span className="text-white font-bold text-2xl">
            {user?.username ? `Hi ${user.username}!` : "Welcome"}
          </span>

          {/* Lottie Waving Hand Animation */}
          <div className="h-15 w-15 -rotate-6">
            <Lottie animationData={wavingHandAnimation} loop={true} />
          </div>
        </div>

        {/* Centered Title */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold cursor-pointer"
          onClick={() => navigate('/home')}
        >
          EME Journal
        </div>

        {/* Right Section: Bell Icon & Profile Dropdown */}
        <div className="relative flex items-center space-x-4">
          
          {/* Bell Icon - Updated onClick handler */}
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

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef} onMouseLeave={() => setDropdownVisible(false)} onMouseEnter={() => setDropdownVisible(true)}>
            <div
              className="flex items-center p-2 border-2 border-white rounded-full transition-all duration-300 hover:text-teal-600 cursor-pointer hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 mt-2 mb-2"
              onClick={toggleDropdown}
              role="button"
              aria-haspopup="true"
              aria-expanded={dropdownVisible}
            >
              <UserIcon className="h-6 w-6 text-white transition-all duration-300" />
            </div>

            {dropdownVisible && (
              <div className="absolute right-0 w-48 bg-white text-teal-700 rounded-lg shadow-md" onMouseEnter={() => setDropdownVisible(true)}>
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleNavigation('/change-password')}> Change Password </li>
                  {user && (user.toggler === 'E' || user.toggler === 'AE') && (
                    <>
                      <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleNavigation('/users-requests')}> Users And Requests </li>
                      <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleNavigation('/approvals')}> Approvals </li>
                    </>
                  )}
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