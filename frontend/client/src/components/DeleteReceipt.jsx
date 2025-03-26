import React, { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const DeleteReceipt = ({ newReceipt, onSuccess }) => {
  const { setReceipts } = useContext(AppContext);

  const handleDeleteReceipt = async () => {
    try {
      if (!newReceipt || !newReceipt.date) {
        throw new Error('Receipt data or date is missing');
      }

      if (!newReceipt.voucherType || !newReceipt.voucherNo) {
        throw new Error(`Required fields missing - Voucher Type: ${newReceipt.voucherType}, Voucher No: ${newReceipt.voucherNo}`);
      }

      const financialYear = getFinancialYear(newReceipt.date);

      // Add better logging for counter voucher deletion attempt
      console.log('Attempting to delete counter voucher with params:', {
        year: financialYear,
        voucherType: 'CE_RV',
        voucherNo: Number(newReceipt.voucherNo)  // Ensure number type
      });

      // First, try to delete the corresponding counter voucher
      try {
        const counterVoucherResponse = await axios.delete(
          `http://localhost:5000/api/payments`, {
            params: {
              year: financialYear,
              voucherType: 'CE_RV',
              voucherNo: Number(newReceipt.voucherNo),  // Ensure number type
              isCounterVoucher: true  // Add flag to identify counter voucher deletion
            }
          }
        );
        console.log('Counter voucher deletion response:', counterVoucherResponse.data);
      } catch (error) {
        console.error('Counter voucher deletion error:', error.response?.data || error);
      }

      // Then delete the receipt
      const response = await axios.delete(
        `http://localhost:5000/api/receipts`, {
          params: {
            year: financialYear,
            voucherType: newReceipt.voucherType,
            voucherNo: newReceipt.voucherNo,
            particulars: newReceipt.particulars // Pass particulars to identify if custom or unit
          }
        }
      );

      console.log('Delete response:', response.data);
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error deleting receipt";
      console.error("Error details:", {
        message: errorMessage,
        receiptData: newReceipt
      });
      alert(errorMessage);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDeleteReceipt}
      className='bg-red-500 hover:bg-red-600 border-1 border-black text-white px-4 py-2 rounded-lg hover:scale-110 transition-transform duration-200'
    >
      Delete Receipt
    </button>
  );
};

export default DeleteReceipt;
