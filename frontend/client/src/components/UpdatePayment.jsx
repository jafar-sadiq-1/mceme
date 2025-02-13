import React, { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const UpdatePayment = ({ newPayment, onSuccess }) => {
  const { setPayments } = useContext(AppContext);

  const handleUpdatePayment = async () => {
    try {
      const financialYear = getFinancialYear(newPayment.date);

      const updatedPayment = {
        ...newPayment,
        financialYear,
        date: new Date(newPayment.date).toISOString(),
        paymentType: newPayment.paymentType === "Custom" 
          ? newPayment.customPaymentType 
          : newPayment.paymentType,
        particulars: newPayment.particulars === "Custom" 
          ? newPayment.customParticulars 
          : newPayment.particulars,
        // Ensure numeric fields are numbers
        voucherNo: Number(newPayment.voucherNo),
        cash: Number(newPayment.cash || 0),
        bank: Number(newPayment.bank || 0),
        fdr: Number(newPayment.fdr || 0),
        syDr: Number(newPayment.syDr || 0),
        syCr: Number(newPayment.syCr || 0),
        property: Number(newPayment.property || 0),
        emeJournalFund: Number(newPayment.emeJournalFund || 0)
      };

      console.log('Sending update data:', updatedPayment); // Debug log

      const response = await axios.put(
        `http://localhost:5000/api/payments?year=${financialYear}`, 
        updatedPayment
      );
      
      console.log('Update response:', response.data); // Debug log
      onSuccess();
    } catch (error) {
      console.error("Full error details:", error.response?.data);
      throw new Error(error.response?.data?.message || "Error updating payment");
    }
  };

  return (
    <button
      type="button"
      onClick={handleUpdatePayment}
      className="bg-green-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-110 transition-transform duration-200"
    >
      Update Payment
    </button>
  );
};

export default UpdatePayment;
