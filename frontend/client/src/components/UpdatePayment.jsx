import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const UpdatePayment = ({ newPayment, onSuccess }) => {
  const [error, setError] = useState("");

  const handleUpdatePayment = async () => {
    try {
      // Create notification for update request
      const notificationData = {
        notificationType: 'update',
        status: 'pending',
        details: {
          ...newPayment,
          type: 'payment',
          action: 'update'
        }
      };

      // Send to notifications endpoint
      const notificationResponse = await axios.post(
        'http://localhost:5000/api/notifications/add',
        notificationData
      );

      if (notificationResponse.data) {
        alert('Update request sent for approval');
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Error creating update request";
      console.error("Error details:", error);
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleUpdatePayment}
        className="bg-green-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-110 transition-transform duration-200"
      >
        Update Payment
      </button>
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default UpdatePayment;
