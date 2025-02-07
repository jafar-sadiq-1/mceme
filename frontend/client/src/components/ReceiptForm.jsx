import React, { useState } from 'react';
import AddReceipt from './AddReceipt';
import UpdateReceipt from './UpdateReceipt';
import DeleteReceipt from './DeleteReceipt';

const ReceiptForm = () => {
  const initialState = {
    date: "",
    rv: "RV",
    rvNo: "",
    particulars: "",
    customParticulars: "",
    cash: "",
    bank: "",
    fdr: "",
    syDr: "",
    syCr: "",
    property: "",
    emeJournalFund: "",
  };

  const [newReceipt, setNewReceipt] = useState(initialState);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [error, setError] = useState(null);

  const particularsOptions = [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Custom"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "particulars") {
      if (value === "Custom") {
        setIsCustomSelected(true);
        setNewReceipt((prev) => ({
          ...prev,
          particulars: prev.customParticulars || "",
          customParticulars: prev.customParticulars || ""
        }));
      } else {
        setIsCustomSelected(false);
        setNewReceipt((prev) => ({
          ...prev,
          particulars: value,
          customParticulars: ""
        }));
      }
    } else if (name === "customParticulars") {
      setNewReceipt((prev) => ({
        ...prev,
        customParticulars: value,
        particulars: value
      }));
    } else {
      setNewReceipt((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setNewReceipt(initialState);
    setIsCustomSelected(false);
    setError(null);
  };

  const validateForm = () => {
    if (!newReceipt.date) {
      setError("Date is required");
      return false;
    }
    if (!newReceipt.particulars) {
      setError("Particulars is required");
      return false;
    }
    if (newReceipt.rv !== "BBF" && !newReceipt.rvNo) {
      setError("RV number is required");
      return false;
    }
    setError(null);
    return true;
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-black mb-4">Manage Receipts</h2>
      <form className="space-y-4">
        <div>
          <label className="block font-serif text-gray-700 font-medium mb-1">Date:</label>
          <input
            type="date"
            name="date"
            value={newReceipt.date}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">RV:</label>
          <div className="flex space-x-2">
            <select
              name="rv"
              value={newReceipt.rv}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="RV">RV</option>
              <option value="CE RV">CE RV</option>
              <option value="BBF">BBF</option>
            </select>
            <input
              type="text"
              name="rvNo"
              value={newReceipt.rvNo}
              onChange={handleInputChange}
              placeholder={
                newReceipt.rv === "BBF" ? "" : `Enter ${newReceipt.rv} number`
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              disabled={newReceipt.rv === "BBF"}
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Particulars:</label>
          <div className="flex space-x-2">
            <select
              name="particulars"
              value={isCustomSelected ? "Custom" : newReceipt.particulars}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select Particulars</option>
              {particularsOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {isCustomSelected && (
              <input
                type="text"
                name="customParticulars"
                value={newReceipt.customParticulars}
                onChange={handleInputChange}
                placeholder="Enter custom particulars"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            )}
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Cash:</label>
          <input
            type="number"
            name="cash"
            value={newReceipt.cash}
            onChange={handleInputChange}
            placeholder="Enter cash amount"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Bank:</label>
          <input
            type="number"
            name="bank"
            value={newReceipt.bank}
            onChange={handleInputChange}
            placeholder="Enter bank amount"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">FDR:</label>
          <input
            type="number"
            name="fdr"
            value={newReceipt.fdr}
            onChange={handleInputChange}
            placeholder="Enter FDR amount"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Sy Dr:</label>
          <input
            type="number"
            name="syDr"
            value={newReceipt.syDr}
            onChange={handleInputChange}
            placeholder="Enter Sy Dr amount"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Sy Cr:</label>
          <input
            type="number"
            name="syCr"
            value={newReceipt.syCr}
            onChange={handleInputChange}
            placeholder="Enter Sy Cr amount"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Property:</label>
          <input
            type="number"
            name="property"
            value={newReceipt.property}
            onChange={handleInputChange}
            placeholder="Enter Property amount"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">EME Journal Fund:</label>
          <input
            type="number"
            name="emeJournalFund"
            value={newReceipt.emeJournalFund}
            onChange={handleInputChange}
            placeholder="Enter EME Journal Fund amount"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div className="flex space-x-4 mt-4">
          <AddReceipt 
            newReceipt={newReceipt} 
            onSuccess={() => {
              resetForm();
              // You can add a success message here if needed
            }}
            validateForm={validateForm}
          />
          <UpdateReceipt 
            newReceipt={newReceipt}
            onSuccess={() => {
              resetForm();
              // You can add a success message here if needed
            }}
            validateForm={validateForm}
          />
          <DeleteReceipt 
            year={new Date(newReceipt.date).getFullYear()}
            rv={newReceipt.rv}
            rvNo={newReceipt.rvNo}
            onSuccess={() => {
              resetForm();
              // You can add a success message here if needed
            }}
            validateForm={validateForm}
          />
        </div>
        <div className="mt-4">
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReceiptForm;