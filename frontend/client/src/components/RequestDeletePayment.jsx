import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYear } from '../utils/financialYearHelper';

const RequestDeletePayment = ({ newPayment, approval, setApprovalData }) => {
  const { setPayments } = useContext(AppContext);
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

  const deleteCounterVoucher = async (financialYear, voucherNo) => {
    try {
      await axios.delete(`http://localhost:5000/api/receipts`, {
        params: {
          year: financialYear,
          voucherType: 'CE_PV',  
          voucherNo: voucherNo
        }
      });
      console.log('Counter voucher deleted successfully');
    } catch (error) {
      console.error('Error deleting counter voucher:', error);
      throw new Error('Failed to delete counter voucher');
    }
  };

  const handleDeletePayment = async () => {
    setLoading(true);
    try {
      if (!newPayment || !newPayment.date) {
        throw new Error('Payment data or date is missing');
      }

      if (!newPayment.voucherType || !newPayment.voucherNo) {
        throw new Error(`Required fields missing - Voucher Type: ${newPayment.voucherType}, Voucher No: ${newPayment.voucherNo}`);
      }

      const financialYear = getFinancialYear(newPayment.date);

      // First delete the payment
      const response = await axios.delete(
        `http://localhost:5000/api/payments`, {
          params: {
            year: financialYear,
            voucherType: newPayment.voucherType,
            voucherNo: newPayment.voucherNo,
            method: newPayment.method,
            particulars: newPayment.particulars,
            paymentType: newPayment.paymentType
          }
        }
      );

      // If payment is deleted successfully, try to delete its counter voucher
      if (response.data) {
        try {
          await deleteCounterVoucher(financialYear, newPayment.voucherNo);
        } catch (counterError) {
          console.warn('Counter voucher deletion failed:', counterError);
          // Don't throw error if counter voucher deletion fails
          // as it might not exist
        }
      }

      try {
        await handleUpdateApproval();
        alert('Payment deleted and approval status updated successfully');
      } catch (approvalError) {
        console.error("Error updating approval:", approvalError);
        alert('Payment deleted but failed to update approval status');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error deleting payment";
      console.error("Error details:", {
        message: errorMessage,
        paymentData: newPayment
      });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDeletePayment}
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

export default RequestDeletePayment;
