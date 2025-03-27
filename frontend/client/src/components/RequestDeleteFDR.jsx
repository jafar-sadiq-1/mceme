import React, { useState } from 'react';
import axios from 'axios';

const DeleteForm = ({ newFdr, approval, setApprovalData }) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateApproval = async () => {
    try {
      if (!approval._id) {
        throw new Error('Approval ID is missing');
      }

      const response = await axios.put(
        `http://localhost:5000/api/approvalsRoute/update-status/${approval._id}`,
        { status: 'approved' }
      );

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
  
  const handleDeleteFdr = async () => {
    setLoading(true);
    try {
      if (!newFdr.fdrNo) {
        throw new Error("FDR No is required to delete");
      }
      
      const response = await axios.delete(
        `http://localhost:5000/api/fdr/${newFdr.fdrNo}`
      );

      console.log("FDR deleted successfully:", response.data);

      try {
        await handleUpdateApproval();
        alert('FDR deleted and approval status updated successfully');
      } catch (approvalError) {
        console.error("Error updating approval:", approvalError);
        alert('FDR deleted but failed to update approval status');
      }
    } catch (error) {
      console.error("Error deleting FDR:", error);
      alert(error.message || "Error deleting FDR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDeleteFdr}
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

export default DeleteForm;
