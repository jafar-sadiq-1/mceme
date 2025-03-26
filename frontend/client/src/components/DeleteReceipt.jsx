import React, { useState } from 'react';
import axios from 'axios';

const DeleteReceipt = ({ newReceipt, onSuccess }) => {
  const [error, setError] = useState("");

  const handleDeleteReceipt = async () => {
    try {
      // Create notification for delete request
      const notificationData = {
        notificationType: 'delete',
        status: 'pending',
        details: {
          ...newReceipt,
          type: 'receipt',
          action: 'delete'
        }
      };

      // Send to notifications endpoint
      const notificationResponse = await axios.post(
        'http://localhost:5000/api/notifications/add',
        notificationData
      );

      if (notificationResponse.data) {
        alert('Delete request sent for approval');
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Error creating delete request";
      console.error("Error details:", error);
      setError(errorMessage);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="button"
        onClick={handleDeleteReceipt}
        className="bg-red-500 hover:bg-red-600 border-1 border-black text-white px-4 py-2 rounded-lg hover:scale-110 transition-transform duration-200"
      >
        Request Delete
      </button>
    </div>
  );
};

export default DeleteReceipt;
