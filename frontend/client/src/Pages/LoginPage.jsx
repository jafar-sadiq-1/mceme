import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import backgroundImage from "../assets/image.jpg"; // Import background image

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login & signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Navigation hook

  // Array to store registered users (instead of localStorage)
  const [registeredUsers, setRegisteredUsers] = useState([
    { username: "admin", password: "admin123" }, // Example pre-registered user
  ]);

  // Handle login or signup
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      // Check for duplicate username
      if (registeredUsers.some((user) => user.username === username)) {
        alert("Username already exists! Please choose a different one.");
        return;
      }

      // Register new user
      setRegisteredUsers([...registeredUsers, { username, password }]);
      alert("Sign-up successful! Please log in.");
      setIsSignUp(false); // Switch to login mode
    } else {
      // Validate login
      const validUser = registeredUsers.find(
        (user) => user.username === username && user.password === password
      );

      if (validUser) {
        // alert("Login successful!");
        navigate("/home"); // Redirect to home
      } else {
        alert("Invalid username or password.");
      }
    }

    // Clear input fields
    setUsername("");
    setPassword("");
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }} // Set background dynamically
    >
      <div className="relative w-[400px] h-[400px] p-8 rounded-lg shadow-lg">
        {/* Form Container */}
        <div className="relative w-full h-full flex overflow-hidden">
          <div
            className={`transition-all duration-1000 ease-in-out transform w-full absolute top-0 left-0 h-full flex items-center justify-center ${
              isSignUp ? "translate-x-[100%]" : ""
            }`}
          >
            {/* Login Form */}
            <div className="w-full h-full flex flex-col items-center justify-center bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8">
              <h2 className="text-2xl text-center mb-8 text-gray-800 font-bold">
                LOGIN
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Username Input */}
                <div className="mb-[50px] relative">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full h-[35px] pl-12 pr-4 border-2 border-gray-300 rounded-full text-black text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="mb-[70px] relative">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-[35px] pl-12 pr-4 border-2 border-gray-300 rounded-full text-center text-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full p-1 bg-green-500 text-white text-xl font-bold rounded-full hover:bg-blue-600 focus:outline-none"
                >
                  Login
                </button>
              </form>
              <div className="text-center mt-4">
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-black-500 font-bold text-l hover:underline"
                >
                  New user? Sign Up
                </button>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 ease-in-out transform w-full absolute top-0 right-0 h-full flex items-center justify-center ${
              isSignUp ? "" : "translate-x-[-100%]"
            }`}
          >
            {/* Sign Up Form */}
            <div className="w-full h-full flex flex-col items-center justify-center bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8">
              <h2 className="text-2xl text-center mb-8 text-gray-800 font-bold">
                SIGN UP
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Username Input */}
                <div className="mb-[50px] relative">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter Username"
                    className="w-full h-[35px] pl-12 pr-4 border-2 border-gray-300 rounded-full text-black text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="mb-[70px] relative">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full h-[35px] pl-12 pr-4 border-2 border-gray-300 rounded-full text-center text-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full p-1 bg-green-500 text-white text-xl font-bold rounded-full hover:bg-blue-600 focus:outline-none"
                >
                  Send Request
                </button>
              </form>
              <div className="text-center mt-4">
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-black-500 font-bold  text-xl hover:underline"
                >
                  Click to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
