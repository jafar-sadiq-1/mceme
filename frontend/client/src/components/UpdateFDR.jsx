import React from "react";
import axios from "axios";

const UpdateForm = ({ newFdr }) => {
  const handleUpdateFdr = () => {
    if (!newFdr.fdrNo) {
      alert("FDR No is required for update");
      return;
    }
    axios
      .put(`http://localhost:5000/api/fdr/${newFdr.fdrNo}`, newFdr)
      .then((response) => {
        console.log("FDR updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating FDR:", error);
      });
  };

  return (
    <button
      type="submit"
      onClick={handleUpdateFdr}
      className="bg-green-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-110 transition-transform duration-200"
    >
      Update FDR
    </button>
  );
};

export default UpdateForm;
