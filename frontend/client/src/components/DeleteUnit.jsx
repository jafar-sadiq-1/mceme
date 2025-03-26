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
      className="bg-red-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:scale-110 transition-transform duration-200"
      onClick={handleDeleteUnit}
    >
      Delete Unit
    </button>
  );
};

export default DeleteUnit;
