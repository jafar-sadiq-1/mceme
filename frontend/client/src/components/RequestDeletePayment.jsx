import React, { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const RequestDeletePayment = ({ newPayment, onSuccess }) => {
  const { setPayments } = useContext(AppContext);

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
      if (!newPayment || !newPayment.date) {
        throw new Error('Payment data or date is missing');
      }

      if (!newPayment.voucherType || !newPayment.voucherNo) {
        throw new Error(`Required fields missing - Voucher Type: ${newPayment.voucherType}, Voucher No: ${newPayment.voucherNo}`);
      }

      const financialYear = getFinancialYear(newPayment.date);

      // First delete the payment
      const response = await axios.delete(
        `http://localhost:5000/api/payments`, {
          params: {
            year: financialYear,
            voucherType: newPayment.voucherType,
            voucherNo: newPayment.voucherNo,
            method: newPayment.method,
            particulars: newPayment.particulars,
            paymentType: newPayment.paymentType
          }
        }
      );

      // If payment is deleted successfully, try to delete its counter voucher
      if (response.data) {
        try {
          await deleteCounterVoucher(financialYear, newPayment.voucherNo);
        } catch (counterError) {
          console.warn('Counter voucher deletion failed:', counterError);
          // Don't throw error if counter voucher deletion fails
          // as it might not exist
        }
      }

      console.log('Delete response:', response.data);
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error deleting payment";
      console.error("Error details:", {
        message: errorMessage,
        paymentData: newPayment
      });
      alert(errorMessage);
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

export default RequestDeletePayment;
