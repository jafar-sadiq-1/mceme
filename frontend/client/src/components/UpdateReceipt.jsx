import React from 'react';
import axios from 'axios';

const UpdateReceipt = ({ newReceipt }) => {

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

      console.log(updatedReceipt);
      // Sending a PUT request to the backend to update the receipt
      const response = await axios.put('http://localhost:5000/api/receipts/', updatedReceipt);
      console.log(response.data);
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
