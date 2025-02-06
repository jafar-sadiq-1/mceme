import React from 'react';
import axios from 'axios';  // Importing Axios

const DeleteReceipt = ({ year, rv, rvNo }) => {
  
  const handleDeleteReceipt = async () => {
    try {
      // Sending the DELETE request with year, rv, and rvNo
      const response = await axios.delete('http://localhost:5000/api/receipts', {
        params: {
          year,
          rv,
          rvNo,
        },
      });

      // If the deletion is successful
      if (response.status === 200) {
        console.log("Receipt deleted successfully:", response.data);
        // Optionally, update the UI here or show a success message
      }
    } catch (error) {
      console.error("Error deleting receipt:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDeleteReceipt}
      className="bg-red-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:scale-110 transition-transform duration-200"
    >
      Delete Receipt
    </button>
  );
};

export default DeleteReceipt;
