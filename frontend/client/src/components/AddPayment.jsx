import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';

const AddPayment = ({ newPayment, onSuccess }) => {
  const { setPayments } = useContext(AppContext);
  const [error, setError] = useState("");
  
  // Function to handle adding payment
  const handleAddPayment = async () => {
    try {
      setError(""); // Clear any previous errors
      
      await axios.post("http://localhost:5000/api/payments", newPayment);
      
      // Refresh the payments list
      const response = await axios.get("http://localhost:5000/api/payments");
      setPayments(response.data);
      
      // Reset the form
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error adding payment";
      setError(errorMessage);
      console.error("Error adding payment:", errorMessage);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleAddPayment}
        className="bg-blue-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition-transform duration-200"
      >
        Add Payment
      </button>
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default AddPayment;
