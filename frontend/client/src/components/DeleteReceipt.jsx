import React, { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const DeleteReceipt = ({ newReceipt, onSuccess }) => {
  const { setReceipts } = useContext(AppContext);

  const handleDeleteReceipt = async () => {
    try {
      console.log('newReceipt prop:', newReceipt);

      if (!newReceipt || !newReceipt.date) {
        throw new Error('Receipt data or date is missing');
      }

      if (!newReceipt.voucherType || !newReceipt.voucherNo) {
        throw new Error(`Required fields missing - Voucher Type: ${newReceipt.voucherType}, Voucher No: ${newReceipt.voucherNo}`);
      }

      const financialYear = getFinancialYear(newReceipt.date);

      const response = await axios.delete(
        `http://localhost:5000/api/receipts`, {
          params: {
            year: financialYear,
            voucherType: newReceipt.voucherType,
            voucherNo: newReceipt.voucherNo
          }
        }
      );

      console.log('Delete response:', response.data);
      onSuccess();
    } catch (error) {
      const errorMessage = error.message || "Error deleting receipt";
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
