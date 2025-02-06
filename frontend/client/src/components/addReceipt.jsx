import React from 'react';
import axios from 'axios';

const AddReceipt = ({ newReceipt }) => {
  
  // Function to handle adding receipt
  const handleAddReceipt = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/receipts", newReceipt);
      // Optionally notify user of success (e.g., alert, toast, etc.)
      console.log('Receipt added successfully:', response.data);
      // You can also trigger a parent callback to refresh the receipts list
    } catch (error) {
      console.error("Error adding receipt:", error);
      // Optionally show an error message
    }
  };

  return (
    <button
      type="button" // Prevents form submission
      onClick={handleAddReceipt}
      className="bg-blue-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition-transform duration-200"
    >
      Add Receipt
    </button>
  );
};

export default AddReceipt;
