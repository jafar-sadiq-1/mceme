import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const UpdateReceipt = ({ newReceipt, onSuccess }) => {
  const { setReceipts } = useContext(AppContext);
  const [error, setError] = useState("");

  const handleUpdateReceipt = async () => {
    try {
      const financialYear = getFinancialYear(newReceipt.date);

      // If not custom particulars, handle unit history updates
      if (newReceipt.particulars !== "Custom") {
        // Fetch the unit
        const unitResponse = await axios.get(`http://localhost:5000/api/units/${newReceipt.particulars}`);
        const unit = unitResponse.data;

        // 1. First revert previous history changes
        const historyEntries = unit.history.filter(
          h => h.voucherType === newReceipt.voucherType && h.voucherNo === newReceipt.voucherNo
        );

        let updatedUnit = { ...unit };

        // Revert previous changes
        for (const historyEntry of historyEntries) {
          switch (historyEntry.receiptFor) {
            case 'Advance Amount':
              updatedUnit.advanceAmount -= historyEntry.amount;
              break;
            case 'Current Financial Year Amount':
              updatedUnit.currentFinancialAmount += historyEntry.amount;
              break;
            case 'Last Financial Year Amount':
              updatedUnit.lastFinancialYearAmount += historyEntry.amount;
              break;
          }
        }

        // Remove old history entries
        updatedUnit.history = updatedUnit.history.filter(
          h => !(h.voucherType === newReceipt.voucherType && h.voucherNo === newReceipt.voucherNo)
        );

        // 2. Apply new changes similar to AddReceipt
        let remainingReceiptAmount = Number(newReceipt[newReceipt.method] || 0);
        let newHistoryEntries = [];

        // Check last FY amount first
        if (updatedUnit.lastFinancialYearAmount > 0) {
          const amountToReduceLastFY = Math.min(updatedUnit.lastFinancialYearAmount, remainingReceiptAmount);
          updatedUnit.lastFinancialYearAmount -= amountToReduceLastFY;
          remainingReceiptAmount -= amountToReduceLastFY;

          if (amountToReduceLastFY > 0) {
            newHistoryEntries.push({
              financialYear: getFinancialYear(newReceipt.date),
              dateReceived: new Date(newReceipt.date).toISOString(),
              voucherType: newReceipt.voucherType,
              voucherNo: Number(newReceipt.voucherNo),
              amount: amountToReduceLastFY,
              typeOfVoucher: newReceipt.receiptType === "Custom" 
                ? newReceipt.customReceiptType 
                : newReceipt.receiptType,
              receiptFor: "Last Financial Year Amount"
            });
          }
        }

        // Check current FY amount
        if (remainingReceiptAmount > 0 && updatedUnit.currentFinancialAmount > 0) {
          const amountToReduceCurrentFY = Math.min(updatedUnit.currentFinancialAmount, remainingReceiptAmount);
          updatedUnit.currentFinancialAmount -= amountToReduceCurrentFY;
          remainingReceiptAmount -= amountToReduceCurrentFY;

          if (amountToReduceCurrentFY > 0) {
            newHistoryEntries.push({
              financialYear: getFinancialYear(newReceipt.date),
              dateReceived: new Date(newReceipt.date).toISOString(),
              voucherType: newReceipt.voucherType,
              voucherNo: Number(newReceipt.voucherNo),
              amount: amountToReduceCurrentFY,
              typeOfVoucher: newReceipt.receiptType === "Custom" 
                ? newReceipt.customReceiptType 
                : newReceipt.receiptType,
              receiptFor: "Current Financial Year Amount"
            });
          }
        }

        // Add remaining to advance
        if (remainingReceiptAmount > 0) {
          updatedUnit.advanceAmount = (updatedUnit.advanceAmount || 0) + remainingReceiptAmount;
          
          newHistoryEntries.push({
            financialYear: getFinancialYear(newReceipt.date),
            dateReceived: new Date(newReceipt.date).toISOString(),
            voucherType: newReceipt.voucherType,
            voucherNo: Number(newReceipt.voucherNo),
            amount: remainingReceiptAmount,
            typeOfVoucher: newReceipt.receiptType === "Custom" 
              ? newReceipt.customReceiptType 
              : newReceipt.receiptType,
            receiptFor: "Advance Amount"
          });
        }

        // Add new history entries
        updatedUnit.history = [...updatedUnit.history, ...newHistoryEntries];

        // Update the unit
        await axios.put(
          `http://localhost:5000/api/units/update/${newReceipt.particulars}`,
          updatedUnit
        );
      }

      // Update the receipt
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

      const response = await axios.put(
        `http://localhost:5000/api/receipts?year=${financialYear}`, 
        updatedReceipt
      );
      
      console.log('Update response:', response.data);
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Error updating receipt";
      console.error("Full error details:", error.response?.data);
      alert(errorMessage);
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
