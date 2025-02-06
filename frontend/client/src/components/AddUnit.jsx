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
      className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700 focus:outline-none"
      onClick={handleAddUnit}
    >
      Add Unit
    </button>
  );
};

export default AddUnit;
