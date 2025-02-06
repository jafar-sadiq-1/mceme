import React from 'react';
import axios from 'axios';

const DeleteForm = ({ newFdr }) => {
  
  const handleDeleteFdr = () => {
    if (!newFdr.fdrNo) {
      alert("FDR No is required to delete");
      return;
    }
    
    axios
      .delete(`http://localhost:5000/api/fdr/${newFdr.fdrNo}`)
      .then((response) => {
        console.log("FDR deleted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting FDR:", error);
      });
  };

  return (
    <button
      onClick={handleDeleteFdr}
      className="bg-red-500 text-white px-4 py-2 rounded-lg"
    >
      Delete FDR
    </button>
  );
};

export default DeleteForm;
