import React, { useState } from 'react';

const ReceiptForm = () => {
  const [newReceipt, setNewReceipt] = useState({
    date: "",
    rv: "RV",
    rvNo: "",
    particulars: "",
    cash: "",
    bank: "",
    fdr: "",
    syDr: "",
    syCr: "",
    property: "",
    emeJournalFund: "",
  });

  const [customParticulars, setCustomParticulars] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReceipt((prev) => ({ ...prev, [name]: value }));

    // Handle customParticulars input separately
    if (name === "customParticulars") {
      setCustomParticulars(value);
    }
  };

  const handleParticularsChange = (e) => {
    if (newReceipt.particulars === "custom") {
      setNewReceipt((prev) => ({
        ...prev,
        particulars: customParticulars,
      }));
    } 
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
              <option value="CE PV">CE PV</option>
              <option value="BBF">BBF</option>
            </select>
            <input
              type="text"
              name="rvNo"
              value={newReceipt.rvNo}
              onChange={handleInputChange}
              placeholder={newReceipt.rv === "BBF" ? "" : `Enter ${newReceipt.rv} number`}
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
              value={newReceipt.particulars}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select Particulars</option>
              <option value="Option1">Option 1</option>
              <option value="Option2">Option 2</option>
              <option value="Option3">Option 3</option>
              <option value="custom">Custom</option>
            </select>

            {newReceipt.particulars === "custom" && (
              <div className="w-full">
                <input
                  type="text"
                  name="customParticulars"
                  value={customParticulars}
                  onChange={handleInputChange} // Directly update customParticulars
                  onBlur={handleParticularsChange}
                  placeholder="Enter custom particulars"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
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
            placeholder="Enter property amount"
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
            placeholder="Enter EME journal fund amount"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div className="flex space-x-4">
          {/* Pass props to AddReceipt, UpdateReceipt, and DeleteReceipt as needed */}
        </div>
      </form>
    </div>
  );
};

export default ReceiptForm;
