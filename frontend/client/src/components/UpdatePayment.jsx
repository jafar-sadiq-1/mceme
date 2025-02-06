import React, { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';

const UpdatePayment = ({ newPayment, onSuccess }) => {
  const { setPayments } = useContext(AppContext);

  const handleUpdatePayment = async () => {
    try {
      // Extract year and month from the date field
      const date = new Date(newPayment.date);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });

      const updatedPayment = {
        year,
        month,
        pv: newPayment.pv,
        pvNo: newPayment.pvNo,
        date: newPayment.date,
        particulars: newPayment.particulars,
        cash: newPayment.cash,
        bank: newPayment.bank,
        fdr: newPayment.fdr,
        syDr: newPayment.syDr,
        syCr: newPayment.syCr,
        property: newPayment.property,
        emeJournalFund: newPayment.emeJournalFund,
      };

      // Update the payment
      await axios.put('http://localhost:5000/api/payments', updatedPayment);
      
      // Refresh the payments list
      const response = await axios.get("http://localhost:5000/api/payments");
      setPayments(response.data);
      
      // Reset the form
      onSuccess();
    } catch (error) {
      console.error("Error updating payment:", error);
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
