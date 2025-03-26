import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const UpdateReceipt = ({ newReceipt, onSuccess }) => {
  const { setReceipts } = useContext(AppContext);
  const [error, setError] = useState("");

  const handleUpdateReceipt = async () => {
    try {
      // First create a notification
      const notificationData = {
        notificationType: 'update',
        status: 'pending',
        details: {
          ...newReceipt,
          type: 'receipt',
          action: 'update'
        }
      };

      // Send to notifications endpoint
      const notificationResponse = await axios.post(
        'http://localhost:5000/api/notifications/add',
        notificationData
      );

      if (!notificationResponse.data) {
        throw new Error('Failed to create notification');
      }

      alert('Update request sent for approval');

      // Continue with existing update logic
      const financialYear = getFinancialYear(newReceipt.date);

      // ...existing code for counterVoucherData...

      // ...existing code for unit updates...

      // ...rest of the existing update logic...

      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Error processing update";
      console.error("Error details:", error);
      setError(errorMessage);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="button"
        onClick={handleUpdateReceipt}
        className="bg-green-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-110 transition-transform duration-200"
      >
        Send Update Request
      </button>
    </div>
  );
};

export default UpdateReceipt;
