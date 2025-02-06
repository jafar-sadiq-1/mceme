import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock, FaPhoneAlt, FaEnvelope, FaIdCard, FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import backgroundImage from "../assets/image.jpg";

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [designation, setDesignation] = useState("Developer");
  const [customDesignation, setCustomDesignation] = useState(false);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/.test(password);


  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (isSignUp) {
      // Client-side validation
      if (mobile.length !== 10) {
        alert("Mobile number must be exactly 10 digits.");
        return;
      }
      if (!isValidPassword(password)) {
        alert("Password must be 8+ characters with uppercase, lowercase, number & symbol.");
        return;
      }
  
      // Send the data to the backend for sign-up
      axios
        .post("http://localhost:5000/signup", {
          firstName,
          middleName,
          lastName,
          designation,
          mobileNumber: mobile,
          email,
          username,
          password,
        })
        .then((response) => {
          setMessage("Request sent successfully! After approval you can login. No need to signup again");
          setIsSignUp(false); // Optionally switch to login form
        })
        .catch((error) => {
          setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
        });
        setUsername("");
        setPassword("");
    } else {
      // Handle login if necessary
      axios
      .post("http://localhost:5000/login", { username, password })
      .then((response) => {
         // Log the full response to check its structure
        const token = response.data.token; // Assuming the response contains the token
        if (token) {
          localStorage.setItem("jwtToken", token);
         //  // Store JWT token in localStorage
         const decoded = jwtDecode(token);
        // console.log(decoded);
          setMessage("Login successful!");
          
          // Access the designation from the decoded token
        //  console.log(decodedToken.designation);
          navigate("/home"); // Redirect to home
          window.location.reload();
        } else {
         
          setMessage("No token received from server.");
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
      });
    
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="relative w-[450px] h-[600px]">
        {/* Flip Container */}
        <div
          className={`absolute w-full h-full transition-transform duration-500 flex items-center justify-center  ${
            isSignUp ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Login Page */}
          <div
            className="absolute w-full h-full p-6 bg-white/50 backdrop-blur-md rounded-lg shadow-lg"
            style={{ backfaceVisibility: "hidden", height: isSignUp ? "auto" : "400px" }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">LOGIN</h2>
            <form onSubmit={handleSubmit}>
              <div className="relative mb-4 flex items-center">
                <FaUser className="absolute left-3 text-gray-600" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full p-2 border rounded mb-4 pl-10 text-center"
                  required
                />
              </div>
              <div className="relative mb-4 flex items-center">
                <FaLock className="absolute left-3 text-gray-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-2 border rounded mb-4 pl-10 text-center"
                  required
                />
              </div>
              <div className="text-center mb-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-blue-500 transition-all duration-300 cursor-pointer"
                >
                  Login
                </button>
              </div>
            </form>
            <p className="text-center text-sm pb-2">
              Don't have an account?{" "}
              <span onClick={() => setIsSignUp(true)} className="text-blue-500 cursor-pointer">
                Sign up here
              </span>
            </p>
            {message && <p className="text-center font-bold text-blue-700 mt-4">{message}</p>}
          </div>

          {/* Sign-Up Page */}
          <div
            className="absolute w-full h-full p-3 bg-white/50 backdrop-blur-md rounded-lg shadow-lg rotate-y-180"
            style={{ backfaceVisibility: "hidden", height: isSignUp ? "auto" : "500px" }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">SIGN UP</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-1/3 p-2 border rounded text-center"
                  required
                />
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="Middle Name"
                  className="w-1/3 p-2 border rounded text-center"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-1/3 p-2 border rounded text-center"
                  required
                />
              </div>

              <div className="mb-4">
                <label>
                  Designation:{" "}
                  <input
                    type="checkbox"
                    checked={customDesignation}
                    onChange={() => {
                      setCustomDesignation(!customDesignation);
                      if (!customDesignation) setDesignation(""); // Clear when switching to custom
                      else setDesignation("Developer"); // Default when switching back
                    }}
                  />{" "}
                  Custom
                </label>
                {customDesignation ? (
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Enter Designation"
                    className="w-full p-2 border rounded mb-4 text-center"
                    required
                  />
                ) : (
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full p-2 border rounded mb-4 text-center"
                    required
                  >
                    <option value="Developer">Developer</option>
                    <option value="Manager">Manager</option>
                    <option value="HR">HR</option>
                    <option value="Other">Other</option>
                  </select>
                )}
              </div>

              <div className="relative mb-4 flex items-center">
                <FaPhoneAlt className="absolute left-3 text-gray-600" />
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile Number"
                  className="w-full p-2 border rounded mb-4 pl-10 text-center"
                  required
                />
              </div>

              <div className="relative mb-4 flex items-center">
                <FaEnvelope className="absolute left-3 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-2 border rounded mb-4 pl-10 text-center"
                  required
                />
              </div>

              <div className="relative mb-4 flex items-center">
                <FaIdCard className="absolute left-3 text-gray-600" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full p-2 border rounded mb-4 pl-10 text-center"
                  required
                />
              </div>

              <div className="relative mb-4 flex items-center">
                <FaLock className="absolute left-3 text-gray-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-2 border rounded pl-10 pr-10 text-center"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="text-center mb-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-blue-500 transition-all duration-300 cursor-pointer"
                >
                  SEND REQUEST
                </button>
              </div>
            </form>
            <p className="text-center text-sm">
              Already have an account?{" "}
              <span onClick={() => setIsSignUp(false)} className="text-blue-500 cursor-pointer">
                Login here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
