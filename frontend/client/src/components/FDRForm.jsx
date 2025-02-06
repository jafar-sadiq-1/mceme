import React,{useState} from "react";
import AddForm from "./AddForm";
import UpdateForm from "./UpdateForm";
import DeleteForm from "./DeleteForm";


function FDRForm() {
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

  return (
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
            <AddForm newFdr={newFdr}/>
            <UpdateForm newFdr={newFdr}/> 
            <DeleteForm newFdr={newFdr}/>
          </div>
        </form>
      </div>
  );
}

export default FDRForm;
