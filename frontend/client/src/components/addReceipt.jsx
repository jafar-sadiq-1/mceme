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
      
      if (!validateForm()) return;

      // Get the amount based on the payment method
      let remainingReceiptAmount = Number(newReceipt[newReceipt.method] || 0);
      
      // Skip unit update if it's a custom particular
      if (newReceipt.particulars !== "Custom") {
        // Fetch unit details
        const unitResponse = await axios.get(`http://localhost:5000/api/units/${newReceipt.particulars}`);
        const unit = unitResponse.data;

        let updatedUnit = { ...unit };
        let historyEntries = [];

        // Check both last FY and current FY amounts
        if (unit.lastFinancialYearAmount > 0) {
          // Calculate how much can be reduced from last FY amount
          const amountToReduceLastFY = Math.min(unit.lastFinancialYearAmount, remainingReceiptAmount);
          updatedUnit.lastFinancialYearAmount = unit.lastFinancialYearAmount - amountToReduceLastFY;
          remainingReceiptAmount -= amountToReduceLastFY;

          // Add history entry for last FY payment
          if (amountToReduceLastFY > 0) {
            historyEntries.push({
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

        // If there's still remaining amount and current FY has pending amount
        if (remainingReceiptAmount > 0 && unit.currentFinancialAmount > 0) {
          const amountToReduceCurrentFY = Math.min(unit.currentFinancialAmount, remainingReceiptAmount);
          updatedUnit.currentFinancialAmount = unit.currentFinancialAmount - amountToReduceCurrentFY;
          remainingReceiptAmount -= amountToReduceCurrentFY;

          // Add history entry for current FY payment
          if (amountToReduceCurrentFY > 0) {
            historyEntries.push({
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

        // If there's still remaining amount, add it to advance
        if (remainingReceiptAmount > 0) {
          updatedUnit.advanceAmount = (unit.advanceAmount || 0) + remainingReceiptAmount;
          
          // Add history entry for advance payment
          historyEntries.push({
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
        
        // Create the final update data with all fields including history
        const updateData = {
          ledgerPageNumber: updatedUnit.ledgerPageNumber,
          amount: updatedUnit.amount,
          command: updatedUnit.command,
          currentFinancialAmount: updatedUnit.currentFinancialAmount,
          lastFinancialYearAmount: updatedUnit.lastFinancialYearAmount,
          unpaidAmount: updatedUnit.unpaidAmount,
          advanceAmount: updatedUnit.advanceAmount,
          history: [...(unit.history || []), ...historyEntries] // Explicitly combine existing and new history
        };

        // Update unit in database with complete data
        await axios.put(
          `http://localhost:5000/api/units/update/${newReceipt.particulars}`,
          updateData
        );
      }

      // Prepare and send receipt data
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
