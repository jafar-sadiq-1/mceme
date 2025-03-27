import React, { useState } from 'react';
import axios from 'axios';

const DeleteUnit = ({ newUnit, approval, setApprovalData }) => {
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

  const handleDeleteUnit = async () => {
    setLoading(true);
    try {
      if (!newUnit.nameOfUnit) {
        throw new Error("Unit name is required to delete");
      }
      
      const response = await axios.delete(
        `http://localhost:5000/api/units/delete/${newUnit.nameOfUnit}`
      );

      try {
        await handleUpdateApproval();
        alert('Unit deleted and approval status updated successfully');
      } catch (approvalError) {
        console.error("Error updating approval:", approvalError);
        alert('Unit deleted but failed to update approval status');
      }
    } catch (error) {
      console.error("Error deleting unit:", error);
      alert(error.message || "Error deleting unit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDeleteUnit}
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

export default DeleteUnit;
