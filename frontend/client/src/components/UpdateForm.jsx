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
      onClick={handleUpdateFdr}
      className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
    >
      Update FDR
    </button>
  );
};

export default UpdateForm;
