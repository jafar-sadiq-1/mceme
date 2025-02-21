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
      const financialYear = getFinancialYear(newReceipt.date);

      // Prepare base counter voucher data with all required fields
      let counterVoucherData = {
        date: new Date(newReceipt.date).toISOString(),
        voucherType: 'CE_RV',
        voucherNo: Number(newReceipt.voucherNo),
        counterVoucherNo: Number(newReceipt.voucherNo),
        particulars: newReceipt.particulars === "Custom" 
          ? newReceipt.customParticulars 
          : newReceipt.particulars,
        paymentType: "Counter Entry",  // Ensure this is set
        customPaymentType: "",
        paymentDescription: `Counter entry for receipt voucher ${newReceipt.voucherNo}`,
        method: "none",
        financialYear: getFinancialYear(newReceipt.date),
        emeJournalFund: 0,
        fdr: 0,
        syDr: 0,
        cash: 0,
        bank: 0,
        syCr: 0,
        property: 0
      };

      // Handle different receipt types
      switch(newReceipt.receiptType) {
        case 'Interest on FD':
        case 'UCS Amount':
        case 'Lifetime Subscription':
        case 'Property on Charge':
          counterVoucherData.emeJournalFund = remainingReceiptAmount;
          break;

        case 'Matured FD':
          // Fetch FDR details
          const fdrResponse = await axios.get(`http://localhost:5000/api/fdrs/${newReceipt.fdrNo}`);
          const fdrData = fdrResponse.data;
          
          // Use amount instead of principalAmount to match FDR schema
          counterVoucherData.fdr = fdrData.amount;
          counterVoucherData.emeJournalFund = fdrData.interestAmount;
          break;

        case 'UCS Amount Dr':
          if (newReceipt.particulars !== "Custom") {
            const unitResponse = await axios.get(`http://localhost:5000/api/units/${newReceipt.particulars}`);
            const unit = unitResponse.data;

            if (unit.lastFinancialYearAmount > 0) {
              const amountToReduceLastFY = Math.min(unit.lastFinancialYearAmount, remainingReceiptAmount);
              counterVoucherData.syDr = amountToReduceLastFY;
              
              const remainingForCurrentFY = remainingReceiptAmount - amountToReduceLastFY;
              if (remainingForCurrentFY > 0) {
                counterVoucherData.emeJournalFund = remainingForCurrentFY;
              }
            } else {
              counterVoucherData.emeJournalFund = remainingReceiptAmount;
            }
          }
          break;

        default:
          // No counter voucher needed
          counterVoucherData = null;
      }

      // Skip unit update if it's a custom particular
      if (newReceipt.particulars !== "Custom") {
        // Fetch unit details
        const unitResponse = await axios.get(`http://localhost:5000/api/units/${newReceipt.particulars}`);
        const unit = unitResponse.data;

        let receiptFor = [];
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
        
        // Add all history entries to unit
        updatedUnit.history = [...(unit.history || []), ...historyEntries];

        // Update unit in database
        await axios.put(
          `http://localhost:5000/api/units/update/${newReceipt.particulars}`,
          updatedUnit
        );
      }

      // Prepare and send receipt data
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

      // Create counter voucher if needed
      if (counterVoucherData) {
        try {
          console.log('Sending counter voucher data:', counterVoucherData);
          
          // Ensure all required fields are present and properly formatted
          const finalCounterVoucherData = {
            ...counterVoucherData,
            financialYear: counterVoucherData.financialYear.startsWith('FY') 
              ? counterVoucherData.financialYear 
              : `FY${counterVoucherData.financialYear}`,
            date: new Date(counterVoucherData.date).toISOString(),
            voucherNo: Number(counterVoucherData.voucherNo),
            counterVoucherNo: Number(counterVoucherData.counterVoucherNo),
            paymentType: 'Counter Entry',
            method: counterVoucherData.method || 'none',
            emeJournalFund: Number(counterVoucherData.emeJournalFund || 0),
            fdr: Number(counterVoucherData.fdr || 0),
            syDr: Number(counterVoucherData.syDr || 0),
            cash: Number(counterVoucherData.cash || 0),
            bank: Number(counterVoucherData.bank || 0),
            syCr: Number(counterVoucherData.syCr || 0),
            property: Number(counterVoucherData.property || 0)
          };

          const paymentResponse = await axios.post(
            `http://localhost:5000/api/payments?year=${financialYear}`,
            finalCounterVoucherData
          );
          console.log('Counter voucher created:', paymentResponse.data);
        } catch (error) {
          console.error('Counter voucher error:', error.response?.data);
          console.error('Counter voucher data sent:', counterVoucherData);
          throw error;
        }
      }

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
