import React, { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';

const DeletePayment = ({ year, pv, pvNo, onSuccess }) => {
  
  const { setPayments } = useContext(AppContext);

  const handleDeletePayment = async () => {
    try {
      if (!year || !pv || !pvNo) {
        console.error("Missing required fields for deletion");
        return;
      }

      await axios.delete('http://localhost:5000/api/payments', {
        params: { year, pv, pvNo }
      });
      
      // Refresh the payments list
      const response = await axios.get("http://localhost:5000/api/payments");
      setPayments(response.data);
      
      // Reset the form
      onSuccess();
    } catch (error) {
      console.error("Error deleting payment:", error.response?.data?.message || error.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDeletePayment}
      className="bg-red-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:scale-110 transition-transform duration-200"
    >
      Delete Payment
    </button>
  );
};

export default DeletePayment;
