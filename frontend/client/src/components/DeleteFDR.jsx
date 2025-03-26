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
      type="submit"
      onClick={handleDeleteFdr}
      className="bg-red-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:scale-110 transition-transform duration-200"
    >
      Delete FDR
    </button>
  );
};

export default DeleteForm;
