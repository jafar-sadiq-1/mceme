import React, { useState } from "react";

export default function FDRPage() {
  const [fdrData, setFdrData] = useState([
    {
      sno: 1,
      fdrNo: "FDR001",
      dateOfDeposit: "2023-01-10",
      amount: 100000,
      maturityValue: 110000,
      maturityDate: "2024-01-10",
      duration: "12 months",
      intRate: 10,
      interestAmount: 10000,
      remarks: "",
      bank: "Bank A",
    },
    {
      sno: 2,
      fdrNo: "FDR002",
      dateOfDeposit: "2023-03-15",
      amount: 50000,
      maturityValue: 53000,
      maturityDate: "2024-03-15",
      duration: "12 months",
      intRate: 6,
      interestAmount: 3000,
      remarks: "",
      bank: "Bank B",
    },
    {
      sno: 3,
      fdrNo: "FDR003",
      dateOfDeposit: "2023-06-01",
      amount: 200000,
      maturityValue: 218000,
      maturityDate: "2024-06-01",
      duration: "12 months",
      intRate: 9,
      interestAmount: 18000,
      remarks: "",
      bank: "Bank C",
    },
  ]);

  const [newFdr, setNewFdr] = useState({
    fdrNo: "",
    dateOfDeposit: "",
    amount: "",
    maturityValue: "",
    maturityDate: "",
    duration: "",
    intRate: "",
    interestAmount: "",
    bank: "",
    remarks: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFdr({
      ...newFdr,
      [name]: value,
    });
  };


  const handleRemarksChange = (fdrNo, newRemark) => {
    setFdrData((prevData) =>
      prevData.map((fdr) =>
        fdr.fdrNo === fdrNo ? { ...fdr, remarks: newRemark } : fdr
      )
    );
  };

  const handleAddFdr = (e) => {
    e.preventDefault();
    // Create a new FDR object with the data from the form
    const newFdrData = {
      ...newFdr,
      sno: fdrData.length + 1, // Generate a new sno based on current length of fdrData
    };
    // Add the new FDR object to the existing fdrData array
    setFdrData((prevData) => [...prevData, newFdrData]);
    // Reset the form fields after adding the new FDR
    setNewFdr({
      fdrNo: "",
      dateOfDeposit: "",
      amount: "",
      maturityValue: "",
      maturityDate: "",
      duration: "",
      intRate: "",
      interestAmount: "",
      bank: "",
      remarks: "",
    });
  };

  const handleUpdateFdr = (e) => {
    e.preventDefault();
    // Update the FDR record in fdrData based on fdrNo
    setFdrData((prevData) =>
      prevData.map((fdr) =>
        fdr.fdrNo === newFdr.fdrNo
          ? { ...fdr, ...newFdr } // If fdrNo matches, update the record
          : fdr // If no match, keep the original record
      )
    );
    // Reset the form fields after updating
    setNewFdr({
      fdrNo: "",
      dateOfDeposit: "",
      amount: "",
      maturityValue: "",
      maturityDate: "",
      duration: "",
      intRate: "",
      interestAmount: "",
      bank: "",
      remarks: "",
    });
  };

  const handleDeleteFdr = (e) => {
    e.preventDefault();
    // Delete the FDR record in fdrData based on fdrNo
    setFdrData((prevData) =>
      prevData.filter((fdr) => fdr.fdrNo !== newFdr.fdrNo) // Filter out the FDR with the matching fdrNo
    );
    // Reset the form fields after deletion
    setNewFdr({
      fdrNo: "",
      dateOfDeposit: "",
      amount: "",
      maturityValue: "",
      maturityDate: "",
      duration: "",
      intRate: "",
      interestAmount: "",
      bank: "",
      remarks: "",
    });
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        FDR Details
      </h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-4 py-2 border border-gray-300">S No</th>
            <th className="px-4 py-2 border border-gray-300">FDR No</th>
            <th className="px-4 py-2 border border-gray-300">Date of Deposit</th>
            <th className="px-4 py-2 border border-gray-300">Amount</th>
            <th className="px-4 py-2 border border-gray-300">Maturity Value</th>
            <th className="px-4 py-2 border border-gray-300">Maturity Date</th>
            <th className="px-4 py-2 border border-gray-300">Duration</th>
            <th className="px-4 py-2 border border-gray-300">Int Rate %</th>
            <th className="px-4 py-2 border border-gray-300">Interest Amount</th>
            <th className="px-4 py-2 border border-gray-300">Bank</th>
            <th className="px-4 py-2 border border-gray-300">Bank Remarks</th>
          </tr>
        </thead>
        <tbody>
          {fdrData.map((fdr, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="px-4 py-2 border border-gray-300 text-center">
                {fdr.sno}
              </td>
              <td className="px-4 py-2 border border-gray-300">{fdr.fdrNo}</td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {new Date(fdr.dateOfDeposit).toLocaleDateString("en-GB")}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-right">
                {fdr.amount.toLocaleString()}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-right">
                {fdr.maturityValue.toLocaleString()}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {new Date(fdr.maturityDate).toLocaleDateString("en-GB")}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {fdr.duration}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-right">
                {fdr.intRate}%
              </td>
              <td className="px-4 py-2 border border-gray-300 text-right">
                {fdr.interestAmount.toLocaleString()}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {fdr.bank} {/* Displaying the bank name */}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  placeholder="Enter remarks"
                  value={fdr.remarks}
                  onChange={(e) =>
                    handleRemarksChange(fdr.fdrNo, e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Add/Update FDR</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">FDR No:</label>
            <input
              type="text"
              name="fdrNo"
              value={newFdr.fdrNo}
              onChange={handleInputChange}
              placeholder="Enter FDR No"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date of Deposit:</label>
            <input
              type="date"
              name="dateOfDeposit"
              value={newFdr.dateOfDeposit}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Amount:</label>
            <input
              type="number"
              name="amount"
              value={newFdr.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Maturity Value:</label>
            <input
              type="number"
              name="maturityValue"
              value={newFdr.maturityValue}
              onChange={handleInputChange}
              placeholder="Enter maturity value"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Maturity Date:</label>
            <input
              type="date"
              name="maturityDate"
              value={newFdr.maturityDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Duration:</label>
            <input
              type="text"
              name="duration"
              value={newFdr.duration}
              onChange={handleInputChange}
              placeholder="Enter duration"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Int Rate %:</label>
            <input
              type="number"
              name="intRate"
              value={newFdr.intRate}
              onChange={handleInputChange}
              placeholder="Enter interest rate"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Interest Amount:</label>
            <input
              type="number"
              name="interestAmount"
              value={newFdr.interestAmount}
              onChange={handleInputChange}
              placeholder="Enter interest amount"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Bank:</label>
            <input
              type="text"
              name="bank"
              value={newFdr.bank}
              onChange={handleInputChange}
              placeholder="Enter bank name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Remarks:</label>
            <input
              type="text"
              name="remarks"
              value={newFdr.remarks}
              onChange={handleInputChange}
              placeholder="Enter remarks"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              onClick={handleAddFdr}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add FDR
            </button>
            <button
              type="submit"
              onClick={handleUpdateFdr}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Update FDR
            </button>
            <button
              type="submit"
              onClick={handleDeleteFdr}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete FDR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
