import { useEffect } from "react";

const TokenExpiry = () => {
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        const expiryTime = decoded.exp * 1000; // Convert expiry to milliseconds
        const currentTime = Date.now(); // Get current time

        const timeLeft = expiryTime - currentTime; // Time left until expiry

        if (timeLeft > 0) {
         // console.log(`Token will be removed in ${timeLeft / 1000} seconds`);

          // Remove token exactly when it expires
          setTimeout(() => {
            localStorage.removeItem("jwtToken");
         //   console.log("Token expired and removed from localStorage");
          }, timeLeft);
        } else {
          // Token already expired, remove it immediately
          localStorage.removeItem("jwtToken");
         // console.log("Token already expired and removed");
          localStorage.clear(); // Clear all stored data
          window.location.href = '/';
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("jwtToken"); // Remove invalid token
      }
    }
  }, []);
};

export default TokenExpiry;