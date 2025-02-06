import React, { useState } from 'react';
import AddPayment from './AddPayment';
import UpdatePayment from './UpdatePayment';
import DeletePayment from './DeletePayment';

const PaymentForm = () => {
  const initialState = {
    date: "",
    pv: "PV",
    pvNo: "",
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

  const [newPayment, setNewPayment] = useState(initialState);
  const [isCustomSelected, setIsCustomSelected] = useState(false);

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
        setNewPayment((prev) => ({
          ...prev,
          particulars: prev.customParticulars || "",
          customParticulars: prev.customParticulars || ""
        }));
      } else {
        setIsCustomSelected(false);
        setNewPayment((prev) => ({
          ...prev,
          particulars: value,
          customParticulars: ""
        }));
      }
    } else if (name === "customParticulars") {
      setNewPayment((prev) => ({
        ...prev,
        customParticulars: value,
        particulars: value
      }));
    } else {
      setNewPayment((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setNewPayment(initialState);
    setIsCustomSelected(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-black mb-4">Manage Payments</h2>
      <form className="space-y-4">
        <div>
          <label className="block font-serif text-gray-700 font-medium mb-1">Date:</label>
          <input
            type="date"
            name="date"
            value={newPayment.date}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">PV:</label>
          <div className="flex space-x-2">
            <select
              name="pv"
              value={newPayment.pv}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="PV">PV</option>
              <option value="CE RV">CE RV</option>
              <option value="BBF">BBF</option>
            </select>
            <input
              type="text"
              name="pvNo"
              value={newPayment.pvNo}
              onChange={handleInputChange}
              placeholder={
                newPayment.pv === "BBF" ? "" : `Enter ${newPayment.pv} number`
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              disabled={newPayment.pv === "BBF"}
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Particulars:</label>
          <div className="flex space-x-2">
            <select
              name="particulars"
              value={isCustomSelected ? "Custom" : newPayment.particulars}
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
                value={newPayment.customParticulars}
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
            value={newPayment.cash}
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
            value={newPayment.bank}
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
            value={newPayment.fdr}
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
            value={newPayment.syDr}
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
            value={newPayment.syCr}
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
            value={newPayment.property}
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
            value={newPayment.emeJournalFund}
            onChange={handleInputChange}
            placeholder="Enter EME Journal Fund amount"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div className="flex space-x-4">
          <AddPayment newPayment={newPayment} onSuccess={resetForm} />
          <UpdatePayment newPayment={newPayment} onSuccess={resetForm} />
          <DeletePayment 
            year={newPayment.date ? new Date(newPayment.date).getFullYear() : null} 
            pv={newPayment.pv} 
            pvNo={newPayment.pvNo}
            onSuccess={resetForm}
          />
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;