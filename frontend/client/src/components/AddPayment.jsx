import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const AddPayment = ({ newPayment, onSuccess, validateForm }) => {
  const { setPayments } = useContext(AppContext);
  const [error, setError] = useState("");
  
  const handleAddPayment = async () => {
    try {
      setError("");
      
      if (!validateForm()) {
        return;
      }
      
      console.log('New payment:', newPayment); // Add this line for debugging
      const financialYear = getFinancialYear(newPayment.date);
      const paymentData = {
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

      console.log('Sending payment data:', paymentData); // Add this line for debugging
      
      const response = await axios.post(
        `http://localhost:5000/api/payments?year=${financialYear}`, 
        paymentData
      );
      console.log(paymentData)
      
      console.log('Server response:', response.data); // Add this line for debugging
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Error adding payment";
      setError(errorMessage);
      console.error("Full error details:", error.response?.data); // Add this line for debugging
    }
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleAddPayment}
        className="bg-blue-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition-transform duration-200"
      >
        Add Payment
      </button>
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default AddPayment;
