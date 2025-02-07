import React, { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';

const DeleteReceipt = ({ year, rv, rvNo, onSuccess }) => {
  const { setReceipts } = useContext(AppContext);

  const handleDeleteReceipt = async () => {
    try {
      if (!year || !rv || !rvNo) {
        console.error("Missing required fields for deletion");
        return;
      }

      await axios.delete('http://localhost:5000/api/receipts', {
        params: { year, rv, rvNo }
      });
      
      // Refresh the receipts list
      const response = await axios.get("http://localhost:5000/api/receipts");
      setReceipts(response.data);
      
      // Reset the form
      onSuccess();
    } catch (error) {
      console.error("Error deleting receipt:", error.response?.data?.message || error.message);
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
