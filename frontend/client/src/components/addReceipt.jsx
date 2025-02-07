import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';

const AddReceipt = ({ newReceipt, onSuccess, validateForm }) => {
  const { setReceipts } = useContext(AppContext);
  const [error, setError] = useState("");
  
  // Function to handle adding receipt
  const handleAddReceipt = async () => {
    try {
      // Clear any previous errors
      setError("");

      // Validate the form first
      if (!validateForm()) {
        return;
      }
      
      await axios.post("http://localhost:5000/api/receipts", newReceipt);
      
      // Refresh the receipts list
      const response = await axios.get("http://localhost:5000/api/receipts");
      setReceipts(response.data);
      
      // Reset the form
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error adding receipt";
      setError(errorMessage);
      console.error("Error adding receipt:", errorMessage);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleAddReceipt}
        className="bg-blue-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition-transform duration-200"
      >
        Add Receipt
      </button>
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default AddReceipt;
