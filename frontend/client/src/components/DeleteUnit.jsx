import React from 'react';
import axios from 'axios';

const DeleteUnit = ({ newUnit }) => {
  const handleDeleteUnit = () => {
    axios
      .delete(`http://localhost:5000/api/units/delete/${newUnit.nameOfUnit}`)
      .then((response) => {
        alert('Unit deleted successfully');
      })
      .catch((error) => console.error('Error deleting unit:', error));
  };

  return (
    <button
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none"
      onClick={handleDeleteUnit}
    >
      Delete Unit
    </button>
  );
};

export default DeleteUnit;
