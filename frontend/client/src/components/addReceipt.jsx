import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const AddReceipt = ({ newReceipt, onSuccess, validateForm }) => {
  const { setReceipts } = useContext(AppContext);
  const [error, setError] = useState("");
  
  const handleAddReceipt = async () => {
    try {
      setError("");
      
      if (!validateForm()) {
        return;
      }

      const financialYear = getFinancialYear(newReceipt.date);
      const receiptData = {
        ...newReceipt,
        financialYear,
        date: new Date(newReceipt.date).toISOString(),
        receiptType: newReceipt.receiptType === "Custom" 
          ? newReceipt.customReceiptType 
          : newReceipt.receiptType,
        particulars: newReceipt.particulars === "Custom" 
          ? newReceipt.customParticulars 
          : newReceipt.particulars,
        // Ensure numeric fields are numbers
        voucherNo: Number(newReceipt.voucherNo),
        cash: Number(newReceipt.cash || 0),
        bank: Number(newReceipt.bank || 0),
        fdr: Number(newReceipt.fdr || 0),
        sydr: Number(newReceipt.sydr || 0),
        sycr: Number(newReceipt.sycr || 0),
        property: Number(newReceipt.property || 0),
        eme_journal_fund: Number(newReceipt.eme_journal_fund || 0),
        counterVoucherNo: Number(newReceipt.counterVoucherNo || 0)
      };

      console.log('Sending receipt data:', receiptData); // Add this line for debugging
      
      const response = await axios.post(
        `http://localhost:5000/api/receipts?year=${financialYear}`, 
        receiptData
      );
      
      console.log('Server response:', response.data); // Add this line for debugging
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Error adding receipt";
      setError(errorMessage);
      console.error("Full error details:", error.response?.data); // Add this line for debugging
    }
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleAddReceipt}
        className="bg-blue-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition-transform duration-200"
      >
        Add Receipt
      </button>
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default AddReceipt;
