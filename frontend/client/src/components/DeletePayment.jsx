import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const DeletePayment = ({ newPayment, onSuccess }) => {
  const { setPayments } = useContext(AppContext);
  const [error, setError] = useState("");

  const deleteCounterVoucher = async (financialYear, voucherNo) => {
    try {
      await axios.delete(`http://localhost:5000/api/receipts`, {
        params: {
          year: financialYear,
          voucherType: 'CE_PV',  
          voucherNo: voucherNo
        }
      });
      console.log('Counter voucher deleted successfully');
    } catch (error) {
      console.error('Error deleting counter voucher:', error);
      throw new Error('Failed to delete counter voucher');
    }
  };

  const handleDeletePayment = async () => {
    try {
      // Create notification for delete request
      const notificationData = {
        notificationType: 'delete',
        status: 'pending',
        details: {
          ...newPayment,
          type: 'payment',
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
    <button
      type="button"
      onClick={handleDeletePayment}
      className='bg-red-500 hover:bg-red-600 border-1 border-black text-white px-4 py-2 rounded-lg hover:scale-110 transition-transform duration-200'
    >
      Delete Payment
    </button>
  );
};

export default DeletePayment;
