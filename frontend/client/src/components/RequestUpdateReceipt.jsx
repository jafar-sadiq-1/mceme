import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const RequestUpdateReceipt = ({ newReceipt, approval, setApprovalData }) => {
  const { setReceipts } = useContext(AppContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateApproval = async () => {
    try {
      // Make sure we have the approval ID
      if (!approval._id) {
        throw new Error('Approval ID is missing');
      }

      console.log('Sending approval update request for ID:', approval._id); // Debug log

      const response = await axios.put(
        `http://localhost:5000/api/approvalsRoute/update-status/${approval._id}`, // Updated route path
        {
          status: 'approved'
        }
      );

      console.log('Approval update response:', response.data); // Debug log

      if (response.data && response.data.approval) {
        const updatedApprovalData = response.data.approval;
        setApprovalData(prevData => 
          prevData.map(item => 
            item._id === approval._id ? updatedApprovalData : item
          )
        );
      } else {
        throw new Error('Failed to update approval status');
      }
    } catch (error) {
      console.error("Error updating approval status:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleUpdateReceipt = async () => {
    setLoading(true);
    try {
      const financialYear = getFinancialYear(newReceipt.date);

      // Prepare counter voucher update data
      let counterVoucherData = {
        date: new Date(newReceipt.date).toISOString(),
        voucherType: 'CE_RV',
        voucherNo: Number(newReceipt.voucherNo),
        counterVoucherNo: Number(newReceipt.voucherNo),
        particulars: newReceipt.particulars === "Custom" 
          ? newReceipt.customParticulars 
          : newReceipt.particulars,
        paymentType: "Counter Entry",
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

      let remainingReceiptAmount = Number(newReceipt[newReceipt.method] || 0);

      // Handle different receipt types for counter voucher
      switch(newReceipt.receiptType) {
        case 'Interest on FD':
        case 'UCS Amount':
        case 'Lifetime Subscription':
        case 'Property on Charge':
          counterVoucherData.emeJournalFund = remainingReceiptAmount;
          break;

        case 'Matured FD':
          const fdrResponse = await axios.get(`http://localhost:5000/api/fdrs/${newReceipt.fdrNo}`);
          const fdrData = fdrResponse.data;
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
          counterVoucherData = null;
      }

      // Update the counter voucher if needed
      if (counterVoucherData) {
        try {
          console.log('Updating counter voucher with data:', counterVoucherData);

          const finalCounterVoucherData = {
            ...counterVoucherData,
            financialYear: counterVoucherData.financialYear.startsWith('FY') 
              ? counterVoucherData.financialYear 
              : `FY${counterVoucherData.financialYear}`,
          };

          await axios.put(
            `http://localhost:5000/api/payments?year=${financialYear}`,
            finalCounterVoucherData
          );
          console.log('Counter voucher updated successfully');
        } catch (error) {
          console.error('Counter voucher update error:', error.response?.data);
          throw error;
        }
      }

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

      try {
        // After successful receipt update, update the approval status
        await handleUpdateApproval();
        // Show success message only if both operations succeed
        alert('Receipt updated and approval status updated successfully');
      } catch (approvalError) {
        console.error("Error updating approval:", approvalError);
        alert('Receipt updated but failed to update approval status');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Error updating receipt";
      console.error("Full error details:", error.response?.data);
      setError(errorMessage);
      alert('Failed to update receipt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleUpdateReceipt}
      disabled={loading || approval.status === 'approved'}
      className={`px-4 py-2 text-white rounded transition-colors ${
        loading 
          ? 'bg-yellow-400 cursor-wait'
          : approval.status === 'approved'
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-500 hover:bg-green-600 hover:scale-110'
      }`}
    >
      {loading 
        ? 'Updating...' 
        : approval.status === 'approved' 
        ? 'Update Approved' 
        : 'Approve Update'}
    </button>
  );
};

export default RequestUpdateReceipt;
