import React, { useState } from 'react';
import AddUnitButton from './AddUnit';
import UpdateUnitButton from './UpdateUnit';
import DeleteUnitButton from './DeleteUnit';
import { getFinancialYear } from '../utils/financialYearHelper';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const UnitsForm = () => {
  const [newUnit, setNewUnit] = useState({
    ledgerPageNumber: 0,
    nameOfUnit: '',
    amount: '',
    command: '',
    currentFinancialYear: getFinancialYear(new Date()),
    currentFinancialAmount: 0,
    lastFinancialYearAmount: 0,
    unpaidAmount: 0,
    advanceAmount: 0,
    history: []
  });

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['ledgerPageNumber', 'amount', 'currentFinancialAmount', 'lastFinancialYearAmount', 'unpaidAmount', 'advanceAmount'];
    
    setNewUnit(prevState => ({
      ...prevState,
      [name]: numericFields.includes(name) 
        ? (value === '' ? '' : Number(value))
        : value
    }));
  };

  const validateForm = () => {
    if (!newUnit.nameOfUnit) {
      setError("Unit name is required");
      return false;
    }
    if (!newUnit.ledgerPageNumber) {
      setError("Ledger page number is required");
      return false;
    }
    setError(null);
    return true;
  };

  const handleRequestUpdate = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const decodedToken = jwtDecode(token);
      const username = decodedToken.username;

      const approvalRequest = {
        requestFrom: username,
        requestOn: 'Unit',
        requestType: 'update',
        details: newUnit,
        status: 'pending'
      };

      const response = await axios.post('http://localhost:5000/api/approvals', approvalRequest);
      
      if (response.status === 201) {
        alert('Update request sent for approval');
        setNewUnit({
          ledgerPageNumber: 0,
          nameOfUnit: '',
          amount: '',
          command: '',
          currentFinancialYear: getFinancialYear(new Date()),
          currentFinancialAmount: 0,
          lastFinancialYearAmount: 0,
          unpaidAmount: 0,
          advanceAmount: 0,
          history: []
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Error sending update request');
    }
  };

  const handleRequestDelete = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const decodedToken = jwtDecode(token);
      const username = decodedToken.username;

      const approvalRequest = {
        requestFrom: username,
        requestOn: 'Unit',
        requestType: 'delete',
        details: newUnit,
        status: 'pending'
      };

      const response = await axios.post('http://localhost:5000/api/approvals', approvalRequest);
      
      if (response.status === 201) {
        alert('Delete request sent for approval');
        setNewUnit({
          ledgerPageNumber: 0,
          nameOfUnit: '',
          amount: '',
          command: '',
          currentFinancialYear: getFinancialYear(new Date()),
          currentFinancialAmount: 0,
          lastFinancialYearAmount: 0,
          unpaidAmount: 0,
          advanceAmount: 0,
          history: []
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Error sending delete request');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-black mb-4">Manage Units</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Ledger Pg No:</label>
            <input
              type="number"
              name="ledgerPageNumber"
              value={newUnit.ledgerPageNumber||""}
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
              value={newUnit.nameOfUnit||""}
              onChange={handleInputChange}
              placeholder="Enter unit name"
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
          <div>
            <label className="block text-gray-700 font-medium mb-1">Subscription Amount:</label>
            <input
              type="number"
              name="amount"
              value={newUnit.amount}
              onChange={handleInputChange}
              placeholder="Enter amount for subscription"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>

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
                value={newUnit.currentFinancialAmount || ""}
                onChange={handleInputChange}
                placeholder="Enter current Financial amount to be paid"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Last Financial Year Amount:</label>
              <input
                type="number"
                name="lastFinancialYearAmount"
                value={newUnit.lastFinancialYearAmount || ""}
                onChange={handleInputChange}
                placeholder="Enter last financial amount to be paid"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Unpaid Amount:</label>
              <input
                type="number"
                name="unpaidAmount"
                value={newUnit.unpaidAmount || ""}
                onChange={handleInputChange}
                placeholder="Enter unpaid amount before last financial year"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Advance Amount:</label>
              <input
                type="number"
                name="advanceAmount"
                value={newUnit.advanceAmount || ""}
                onChange={handleInputChange}
                placeholder="Enter advance amount if any"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>
      </form>

      <div className="flex justify-center mt-4 space-x-4">
        <AddUnitButton newUnit={newUnit} />
        <UpdateUnitButton newUnit={newUnit} />
        <DeleteUnitButton newUnit={newUnit} />
        <button
          onClick={handleRequestUpdate}
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Request Update
        </button>
        <button
          onClick={handleRequestDelete}
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Request Delete
        </button>
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default UnitsForm;