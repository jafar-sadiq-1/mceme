import React, { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const DeletePayment = ({ newPayment, onSuccess }) => {
  const { setPayments } = useContext(AppContext);

  const handleDeletePayment = async () => {
    try {
      console.log('newPayment prop:', newPayment);

      if (!newPayment || !newPayment.date) {
        throw new Error('Payment data or date is missing');
      }

      if (!newPayment.voucherType || !newPayment.voucherNo) {
        throw new Error(`Required fields missing - Voucher Type: ${newPayment.voucherType}, Voucher No: ${newPayment.voucherNo}`);
      }

      const financialYear = getFinancialYear(newPayment.date);

      const response = await axios.delete(
        `http://localhost:5000/api/payments`, {
          params: {
            year: financialYear,
            voucherType: newPayment.voucherType,
            voucherNo: newPayment.voucherNo
          }
        }
      );

      console.log('Delete response:', response.data);
      onSuccess();
    } catch (error) {
      const errorMessage = error.message || "Error deleting payment";
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

export default DeletePayment;
