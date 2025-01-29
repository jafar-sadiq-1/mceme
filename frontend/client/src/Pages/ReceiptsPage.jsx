import React, { useState } from "react";

const ReceiptForm = () => {
  const [receipts, setReceipts] = useState([]);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReceipt((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddReceipt = (e) => {
    e.preventDefault();
    if (!newReceipt.rvNo || !newReceipt.date) {
      alert("RV number is required!");
      setNewReceipt({
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
      return;
    }

    setReceipts((prev) => [...prev, newReceipt]);
    setNewReceipt({
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
  };

  const handleUpdateReceipt = (e) => {
    e.preventDefault();
    const index = receipts.findIndex(
      (receipt) => receipt.rv === newReceipt.rv && receipt.rvNo === newReceipt.rvNo
    );

    if (index === -1) {
      alert("No matching receipt found for update!");
      return;
    }
    const updatedReceipts = [...receipts];
    updatedReceipts[index] = newReceipt;

    setReceipts(updatedReceipts);
    alert("Receipt updated successfully!");

    setNewReceipt({
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
  };


  const handleDeleteReceipt = (e) => {
    e.preventDefault();
    setReceipts((prevReceipts) =>
      prevReceipts.filter(
        (receipt) =>
          receipt.rv !== newReceipt.rv || receipt.rvNo !== newReceipt.rvNo
      )
    );
    setNewReceipt({
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
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Receipt Management</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Receipt List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Receipt List</h2>
          {receipts.length > 0 ? (
            <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 border border-gray-300">Date</th>
                <th className="px-4 py-2 border border-gray-300">RV</th>
                <th className="px-4 py-2 border border-gray-300">PARTICULARS</th>
                <th className="px-4 py-2 border border-gray-300">CASH</th>
                <th className="px-4 py-2 border border-gray-300">BANK</th>
                <th className="px-4 py-2 border border-gray-300">FDR</th>
                <th className="px-4 py-2 border border-gray-300">Sy Dr</th>
                <th className="px-4 py-2 border border-gray-300">Sy Cr</th>
                <th className="px-4 py-2 border border-gray-300">PROPERTY</th>
                <th className="px-4 py-2 border border-gray-300">EME JOURNAL FUND</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="px-4 py-2 border border-gray-300 text-center">{new Date(receipt.date).toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-2 border border-gray-300">{receipt.rv+receipt.rvNo.toString()}</td>
                  <td className="px-4 py-2 border border-gray-300">{receipt.particulars}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{receipt.cash}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{receipt.bank}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{receipt.fdr}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{receipt.syDr}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{receipt.syCr}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{receipt.property}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{receipt.emeJournalFund}</td>
                </tr>
              ))}
              <tr className='bg-white'>
                <td className="px-4 py-2 border border-gray-300 text-center"></td>
                <td className="px-4 py-2 border border-gray-300"></td>
                <td className="px-4 py-2 border border-gray-300">Total</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
              </tr>
              <tr className='bg-white'>
                <td className="px-4 py-2 border border-gray-300 text-center"></td>
                <td className="px-4 py-2 border border-gray-300"></td>
                <td className="px-4 py-2 border border-gray-300">Balance</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
              </tr>
              <tr className='bg-white'>
                <td className="px-4 py-2 border border-gray-300 text-center"></td>
                <td className="px-4 py-2 border border-gray-300"></td>
                <td className="px-4 py-2 border border-gray-300">G/Total</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
              </tr>
            </tbody>
          </table>
          ) : (
            <p className="text-gray-700">No receipts added yet.</p>
          )}
        </div>

        {/* Add Receipt Form */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Add/Update Receipt</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Date:</label>
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
              <input
                type="text"
                name="particulars"
                value={newReceipt.particulars}
                onChange={handleInputChange}
                placeholder="Enter particulars"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
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
              <button
                type="submit"
                onClick={handleAddReceipt}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add Receipt
              </button>
              <button
                type="submit"
                onClick={handleUpdateReceipt}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Update Receipt
              </button>
              <button
                type="submit"
                onClick={handleDeleteReceipt}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete Receipt
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReceiptForm;
