import React, { useState } from 'react';
import AddUnitButton from './AddUnit';
import UpdateUnitButton from './UpdateUnit';
import DeleteUnitButton from './DeleteUnit';

const UnitsForm = () => {
  const [newUnit, setNewUnit] = useState({
    ledgerPageNumber: '',
    nameOfUnit: '',
    amount: '',
    command: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUnit((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Add/Update Unit</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Ledger Pg No:</label>
          <input
            type="number"
            name="ledgerPageNumber"
            value={newUnit.ledgerPageNumber}
            onChange={handleInputChange}
            placeholder="Enter ledger page number"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name of Unit:</label>
          <input
            type="text"
            name="nameOfUnit"
            value={newUnit.nameOfUnit}
            onChange={handleInputChange}
            placeholder="Enter unit name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Amount:</label>
          <input
            type="number"
            name="amount"
            value={newUnit.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Comd:</label>
          <input
            type="text"
            name="command"
            value={newUnit.command}
            onChange={handleInputChange}
            placeholder="Enter command"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
      </form>

      <div className="flex justify-center mt-4">
        <AddUnitButton newUnit={newUnit} />
        <UpdateUnitButton newUnit={newUnit} />
        <DeleteUnitButton newUnit={newUnit} />
      </div>
    </div>
  );
};

export default UnitsForm;
