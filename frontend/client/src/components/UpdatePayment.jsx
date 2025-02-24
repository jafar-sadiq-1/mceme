import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const UpdatePayment = ({ newPayment, createCounterVoucher, onSuccess, validateForm }) => {
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
      receiptType: "Counter Entry",
      receiptDescription: `Counter entry for payment voucher ${paymentData.voucherNo}`,
      method: "none",
      financialYear: paymentData.financialYear,
      cash: 0,
      bank: 0,
      fdr: 0,
      sydr: 0,
      sycr: 0,
      property: 0,
      eme_journal_fund: 0
    };

    // Distribute amount based on payment type
    if (paymentData.paymentType === "Depreciation Amount") {
      counterVoucherData.property = totalAmount;
    } else if (paymentData.paymentType === "Wavier") {
      counterVoucherData.sydr = totalAmount;
    } else {
      counterVoucherData.eme_journal_fund = totalAmount;
    }

    return counterVoucherData;
  };

  const handleUpdatePayment = async () => {
    try {
      if (!validateForm()) return;
      const financialYear = getFinancialYear(newPayment.date);

      // If not custom particulars, handle unit updates
      if (newPayment.particulars !== "Custom") {
        // Fetch the unit
        const unitResponse = await axios.get(`http://localhost:5000/api/units/${newPayment.particulars}`);
        const unit = unitResponse.data;

        // 1. First revert previous history changes
        const historyEntries = unit.history.filter(
          h => h.voucherType === newPayment.voucherType && h.voucherNo === newPayment.voucherNo
        );

        let updatedUnit = { ...unit };

        // Revert previous changes if it was a waveoff
        for (const historyEntry of historyEntries) {
          if (historyEntry.typeOfVoucher === "Waveoff") {
            updatedUnit.unpaidAmount += historyEntry.amount;
          }
        }

        // Remove old history entries
        updatedUnit.history = updatedUnit.history.filter(
          h => !(h.voucherType === newPayment.voucherType && h.voucherNo === newPayment.voucherNo)
        );

        // 2. Apply new changes if new payment is waveoff
        if (newPayment.paymentType === "Waveoff") {
          const waveoffAmount = Number(newPayment[newPayment.method] || 0);

          // Validate waveoff amount
          if (waveoffAmount > updatedUnit.unpaidAmount) {
            throw new Error("Waveoff amount cannot be greater than unpaid amount");
          }

          // Update unpaid amount
          updatedUnit.unpaidAmount -= waveoffAmount;

          // Add new history entry
          const historyEntry = {
            financialYear: getFinancialYear(newPayment.date),
            dateReceived: new Date(newPayment.date).toISOString(),
            voucherType: newPayment.voucherType,
            voucherNo: Number(newPayment.voucherNo),
            amount: waveoffAmount,
            typeOfVoucher: newPayment.paymentType,
            receiptFor: "Waveoff"
          };

          updatedUnit.history.push(historyEntry);
        }

        // Update the unit
        await axios.put(
          `http://localhost:5000/api/units/update/${newPayment.particulars}`,
          updatedUnit
        );
      }

      // Update the payment
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
        voucherNo: Number(newPayment.voucherNo),
        cash: Number(newPayment.cash || 0),
        bank: Number(newPayment.bank || 0),
        fdr: Number(newPayment.fdr || 0),
        syDr: Number(newPayment.syDr || 0),
        syCr: Number(newPayment.syCr || 0),
        property: Number(newPayment.property || 0),
        emeJournalFund: Number(newPayment.emeJournalFund || 0)
      };

      const response = await axios.put(
        `http://localhost:5000/api/payments?year=${financialYear}`, 
        updatedPayment
      );

      // Update counter voucher in receipts if exists
      if (createCounterVoucher) {
        try {
          const counterVoucherData = createCounterVoucherData(updatedPayment);
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
            sydr: Number(counterVoucherData.sydr || 0),
            sycr: Number(counterVoucherData.sycr || 0),
            property: Number(counterVoucherData.property || 0),
            eme_journal_fund: Number(counterVoucherData.eme_journal_fund || 0)
          };

          // Update the counter voucher in receipts
          await axios.put(
            `http://localhost:5000/api/receipts?year=${financialYear}`,
            {
              voucherType: 'CE_PV',
              voucherNo: finalCounterVoucherData.voucherNo,
              ...finalCounterVoucherData
            }
          );
        } catch (error) {
          console.error('Counter voucher update error:', error);
          throw new Error('Failed to update counter voucher');
        }
      }

      console.log('Update response:', response.data);
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error updating payment";
      setError(errorMessage);
      console.error("Error details:", error);
      alert(errorMessage);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleUpdatePayment}
        className="bg-green-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-110 transition-transform duration-200"
      >
        Update Payment
      </button>
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default UpdatePayment;
