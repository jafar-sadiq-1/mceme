import React, { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';

const UpdateReceipt = ({ newReceipt, onSuccess }) => {

  const { setReceipts } = useContext(AppContext);

  const handleUpdateReceipt = async () => {
    try {
      // Extract year and month from the date field
      const date = new Date(newReceipt.date);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });

      const updatedReceipt = {
        year,
        month,
        rv: newReceipt.rv,
        rvNo: newReceipt.rvNo,
        date: newReceipt.date,
        particulars: newReceipt.particulars,
        cash: newReceipt.cash,
        bank: newReceipt.bank,
        fdr: newReceipt.fdr,
        syDr: newReceipt.syDr,
        syCr: newReceipt.syCr,
        property: newReceipt.property,
        emeJournalFund: newReceipt.emeJournalFund,
      };

      // Update the receipt
      await axios.put('http://localhost:5000/api/receipts', updatedReceipt);
      
      // Refresh the receipts list
      const response = await axios.get("http://localhost:5000/api/receipts");
      setReceipts(response.data);
      
      // Reset the form
      onSuccess();
    } catch (error) {
      console.error("Error updating receipt:", error);
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
