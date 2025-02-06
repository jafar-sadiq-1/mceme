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
      className="bg-yellow-600 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-700 focus:outline-none"
      onClick={handleUpdateUnit}
    >
      Update Unit
    </button>
  );
};

export default UpdateUnit;

