import React, { useState } from 'react';
import AddUnitButton from './AddUnit';
import UpdateUnitButton from './UpdateUnit';
import DeleteUnitButton from './DeleteUnit';
import { getFinancialYear } from '../utils/financialYearHelper';

const UnitsForm = () => {
  const [newUnit, setNewUnit] = useState({
    ledgerPageNumber: '',
    nameOfUnit: '',
    amount: '',
    command: '',
    // Add new financial fields
    currentFinancialYear: getFinancialYear(new Date()),
    currentFinancialAmount: 0,
    lastFinancialYearAmount: 0,
    unpaidAmount: 0,
    history: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric fields to numbers
    const numericFields = ['ledgerPageNumber', 'amount', 'currentFinancialAmount', 'lastFinancialYearAmount', 'unpaidAmount'];
    
    setNewUnit(prevState => ({
      ...prevState,
      [name]: numericFields.includes(name) ? Number(value) || 0 : value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Add/Update Unit</h2>
      <form className="space-y-4">
        {/* Existing fields */}
        <div className="grid grid-cols-2 gap-4">
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
        </div>

        {/* Financial Information Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Financial Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Current Financial Year:</label>
              <input
                type="text"
                name="currentFinancialYear"
                value={newUnit.currentFinancialYear}
                disabled
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Current Financial Year Amount:</label>
              <input
                type="number"
                name="currentFinancialAmount"
                placeholder="Enter current Financial amount to be paid"
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Last Financial Year Amount:</label>
              <input
                type="number"
                name="lastFinancialYearAmount"
                placeholder="Enter last financial amount to be paid"
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Unpaid Amount:</label>
              <input
                type="number"
                name="unpaidAmount"
                placeholder= "Enter unpaid amount before last financial year"
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Amount:</label>
            <input
              type="number"
              name="amount"
              value={newUnit.amount}
              onChange={handleInputChange}
              placeholder="Enter amount for subscription"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Command:</label>
            <input
              type="text"
              name="command"
              value={newUnit.command}
              onChange={handleInputChange}
              placeholder="Enter command"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>
      </form>

      <div className="flex justify-center mt-4 space-x-4">
        <AddUnitButton newUnit={newUnit} />
        <UpdateUnitButton newUnit={newUnit} />
        <DeleteUnitButton newUnit={newUnit} />
      </div>
    </div>
  );
};

export default UnitsForm;
