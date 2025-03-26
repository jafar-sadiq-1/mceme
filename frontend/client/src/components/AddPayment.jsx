import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const AddPayment = ({ newPayment, createCounterVoucher, onSuccess, validateForm }) => {
  const { setPayments } = useContext(AppContext);
  const [error, setError] = useState("");

  const createCounterVoucherData = (paymentData) => {
    // Calculate total amount from all payment methods
    const totalAmount = Object.entries(paymentData).reduce((sum, [key, value]) => {
      if (['cash', 'bank', 'fdr', 'sydr', 'sycr', 'property', 'eme_journal_fund'].includes(key)) {
        return sum + (Number(value) || 0);
      }
      return sum;
    }, 0);

    // Initialize counter voucher data with correct field names
    const counterVoucherData = {
      date: paymentData.date,
      voucherType: 'CE_PV',
      voucherNo: paymentData.voucherNo,
      counterVoucherNo: paymentData.voucherNo,
      particulars: paymentData.particulars,
      receiptType: "Counter Entry",  // Changed from paymentType
      receiptDescription: `Counter entry for payment voucher ${paymentData.voucherNo}`, // Changed from paymentDescription
      method: "none",
      financialYear: paymentData.financialYear,
      cash: 0,
      bank: 0,
      fdr: 0,
      sydr: 0,  // Changed from syDr
      sycr: 0,  // Changed from syCr
      property: 0,
      eme_journal_fund: 0  // Changed from emeJournalFund
    };

    // Distribute amount based on payment type with correct field names
    if (paymentData.paymentType === "Depreciation Amount") {
      counterVoucherData.property = totalAmount;
    } else if (paymentData.paymentType === "Wavier") {
      counterVoucherData.sydr = totalAmount;  // Changed from syDr
    } else {
      counterVoucherData.eme_journal_fund = totalAmount;  // Changed from emeJournalFund
    }

    return counterVoucherData;
  };

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

      // Add the payment
      const paymentResponse = await axios.post(
        `http://localhost:5000/api/payments?year=${financialYear}`,
        paymentData
      );

      // Create counter voucher in receipts if checkbox is checked
      if (createCounterVoucher) {
        try {
          const counterVoucherData = createCounterVoucherData(paymentData);
          const finalCounterVoucherData = {
            ...counterVoucherData,
            financialYear: counterVoucherData.financialYear.startsWith('FY') 
              ? counterVoucherData.financialYear 
              : `FY${counterVoucherData.financialYear}`,
            date: new Date(counterVoucherData.date).toISOString(),
            voucherNo: Number(counterVoucherData.voucherNo),
            counterVoucherNo: Number(counterVoucherData.counterVoucherNo),
            receiptType: 'Counter Entry',
            method: counterVoucherData.method || 'none',
            cash: Number(counterVoucherData.cash || 0),
            bank: Number(counterVoucherData.bank || 0),
            fdr: Number(counterVoucherData.fdr || 0),
            sydr: Number(counterVoucherData.sydr || 0),  // Changed from syDr
            sycr: Number(counterVoucherData.sycr || 0),  // Changed from syCr
            property: Number(counterVoucherData.property || 0),
            eme_journal_fund: Number(counterVoucherData.eme_journal_fund || 0)  // Changed from emeJournalFund
          };

          await axios.post(
            `http://localhost:5000/api/receipts?year=${financialYear}`,
            finalCounterVoucherData
          );
        } catch (error) {
          console.error('Counter voucher error:', error);
          throw new Error('Failed to create counter voucher');
        }
      }

      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Error adding payment";
      setError(errorMessage);
      console.error("Error details:", error);
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
