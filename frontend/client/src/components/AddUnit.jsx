import React from 'react';
import axios from 'axios';

const AddUnit = ({ newUnit }) => {
  const handleAddUnit = () => {
    console.log(newUnit);
    axios
      .post('http://localhost:5000/api/units/add', newUnit)
      .then((response) => {
        alert('Unit added successfully');
      })
      .catch((error) => console.error('Error adding unit:', error));
  };

  return (
    <button
      className="bg-blue-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition-transform duration-200"
      onClick={handleAddUnit}
    >
      Add Unit
    </button>
  );
};

export default AddUnit;
