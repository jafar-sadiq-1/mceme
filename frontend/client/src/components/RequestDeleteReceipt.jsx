import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const RequestDeleteReceipt = ({ newReceipt, approval, setApprovalData }) => {
  const { setReceipts } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleUpdateApproval = async () => {
    try {
      if (!approval._id) {
        throw new Error('Approval ID is missing');
      }

      console.log('Sending approval update request for ID:', approval._id);

      const response = await axios.put(
        `http://localhost:5000/api/approvalsRoute/update-status/${approval._id}`,
        { status: 'approved' }
      );

      console.log('Approval update response:', response.data);

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
      console.error("Error updating approval status:", error);
      throw error;
    }
  };

  const handleDeleteReceipt = async () => {
    setLoading(true);
    try {
      if (!newReceipt || !newReceipt.date) {
        throw new Error('Receipt data or date is missing');
      }

      if (!newReceipt.voucherType || !newReceipt.voucherNo) {
        throw new Error(`Required fields missing - Voucher Type: ${newReceipt.voucherType}, Voucher No: ${newReceipt.voucherNo}`);
      }

      const financialYear = getFinancialYear(newReceipt.date);

      // Add better logging for counter voucher deletion attempt
      console.log('Attempting to delete counter voucher with params:', {
        year: financialYear,
        voucherType: 'CE_RV',
        voucherNo: Number(newReceipt.voucherNo)  // Ensure number type
      });

      // First, try to delete the corresponding counter voucher
      try {
        const counterVoucherResponse = await axios.delete(
          `http://localhost:5000/api/payments`, {
            params: {
              year: financialYear,
              voucherType: 'CE_RV',
              voucherNo: Number(newReceipt.voucherNo),  // Ensure number type
              isCounterVoucher: true  // Add flag to identify counter voucher deletion
            }
          }
        );
        console.log('Counter voucher deletion response:', counterVoucherResponse.data);
      } catch (error) {
        console.error('Counter voucher deletion error:', error.response?.data || error);
      }

      // Then delete the receipt
      const response = await axios.delete(
        `http://localhost:5000/api/receipts`, {
          params: {
            year: financialYear,
            voucherType: newReceipt.voucherType,
            voucherNo: newReceipt.voucherNo,
            particulars: newReceipt.particulars // Pass particulars to identify if custom or unit
          }
        }
      );

      console.log('Delete response:', response.data);

      try {
        await handleUpdateApproval();
        alert('Receipt deleted and approval status updated successfully');
      } catch (approvalError) {
        console.error("Error updating approval:", approvalError);
        alert('Receipt deleted but failed to update approval status');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error deleting receipt";
      console.error("Error details:", {
        message: errorMessage,
        receiptData: newReceipt
      });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDeleteReceipt}
      disabled={loading || approval.status === 'approved'}
      className={`px-4 py-2 text-white rounded transition-colors ${
        loading 
          ? 'bg-yellow-400 cursor-wait'
          : approval.status === 'approved'
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-red-500 hover:bg-red-600 hover:scale-110'
      }`}
    >
      {loading 
        ? 'Deleting...' 
        : approval.status === 'approved' 
        ? 'Delete Approved' 
        : 'Approve Delete'}
    </button>
  );
};

export default RequestDeleteReceipt;
