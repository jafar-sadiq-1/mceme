import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const AddPayment = ({ newPayment, onSuccess, validateForm }) => {
  const { setPayments } = useContext(AppContext);
  const [error, setError] = useState("");

  const handleAddPayment = async () => {
    try {
      if (!validateForm()) return;

      const financialYear = getFinancialYear(newPayment.date);
      
      // Prepare payment data
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
        // Convert all numeric fields
        voucherNo: Number(newPayment.voucherNo),
        cash: Number(newPayment.cash || 0),
        bank: Number(newPayment.bank || 0),
        fdr: Number(newPayment.fdr || 0),
        syDr: Number(newPayment.syDr || 0),
        syCr: Number(newPayment.syCr || 0),
        property: Number(newPayment.property || 0),
        emeJournalFund: Number(newPayment.emeJournalFund || 0),
        counterVoucherNo: Number(newPayment.counterVoucherNo || 0)
      };

      // Handle waveoff payment type for units
      if (paymentData.paymentType === "Waveoff" && paymentData.particulars !== "Custom") {
        const waveoffAmount = Number(paymentData[paymentData.method] || 0);
        const unitResponse = await axios.get(`http://localhost:5000/api/units/${paymentData.particulars}`);
        const unit = unitResponse.data;

        // Create history entry
        const historyEntry = {
          financialYear: getFinancialYear(paymentData.date),
          dateReceived: paymentData.date,
          voucherType: paymentData.voucherType,
          voucherNo: Number(paymentData.voucherNo),
          amount: waveoffAmount,
          typeOfVoucher: paymentData.paymentType,
          receiptFor: "Waveoff"
        };

        // Update unit
        const updatedUnit = {
          ...unit,
          unpaidAmount: unit.unpaidAmount - waveoffAmount,
          history: [...(unit.history || []), historyEntry]
        };

        await axios.put(
          `http://localhost:5000/api/units/update/${paymentData.particulars}`,
          updatedUnit
        );
      }

      const response = await axios.post(
        `http://localhost:5000/api/payments?year=${financialYear}`,
        paymentData
      );

      console.log('Payment added:', response.data);
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Error adding payment";
      setError(errorMessage);
      console.error("Full error details:", error.response?.data);
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
