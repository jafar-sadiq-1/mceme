import React from 'react';
import axios from 'axios';

const UpdateUnit= ({ newUnit }) => {
  const handleUpdateUnit = () => {
    axios
      .put(`http://localhost:5000/api/units/update/${newUnit.nameOfUnit}`, newUnit)
      .then((response) => {
        alert('Unit updated successfully');
      })
      .catch((error) => console.error('Error updating unit:', error));
  };

  return (
    <button
      className="bg-green-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-green hover:scale-110 transition-transform duration-200"
      onClick={handleUpdateUnit}
    >
      Update Unit
    </button>
  );
};

export default UpdateUnit;

