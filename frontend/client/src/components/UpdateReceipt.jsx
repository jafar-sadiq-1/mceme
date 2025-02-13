import React, { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const UpdateReceipt = ({ newReceipt, onSuccess }) => {
  const { setReceipts } = useContext(AppContext);

  const handleUpdateReceipt = async () => {
    try {
      const financialYear = getFinancialYear(newReceipt.date);

      const updatedReceipt = {
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

      console.log('Sending update data:', updatedReceipt); // Debug log

      const response = await axios.put(
        `http://localhost:5000/api/receipts?year=${financialYear}`, 
        updatedReceipt
      );
      
      console.log('Update response:', response.data); // Debug log
      onSuccess();
    } catch (error) {
      console.error("Full error details:", error.response?.data);
      throw new Error(error.response?.data?.message || "Error updating receipt");
    }
  };

  return (
    <button
      type="button"
      onClick={handleUpdateReceipt}
      className="bg-green-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-110 transition-transform duration-200"
    >
      Update Receipt
    </button>
  );
};

export default UpdateReceipt;
