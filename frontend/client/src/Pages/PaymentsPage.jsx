import React, { useState } from "react";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    date: "",
    pv: "PV",
    pvNo: "",
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
    setNewPayment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddReceipt = (e) => {
    e.preventDefault();
    if (!newPayment.pvNo || !newPayment.date) {
      alert("PV number and Date is required!");
      setNewPayment({
        date: "",
        pv: "PV",
        pvNo: "",
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

    setPayments((prev) => [...prev, newPayment]);
    setNewPayment({
      date: "",
      pv: "PV",
      pvNo: "",
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
    const index = payments.findIndex(
      (payment) => payment.pv === newPayment.pv && payment.pvNo === newPayment.pvNo
    );

    if (index === -1) {
      alert("No matching payment found for update!");
      return;
    }

    const updatedPayments = [...payments];
    updatedPayments[index] = newPayment;

    setPayments(updatedPayments);
    alert("Payment updated successfully!");

    setNewPayment({
      date: "",
      pv: "PV",
      pvNo: "",
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

  const handleDeletePayment = (e) => {
    e.preventDefault();
    setPayments((prevPayments) =>
      prevPayments.filter(
        (payment) =>
          payment.pv !== newPayment.pv || newPayment.pvNo !== newPayment.pvNo
      )
    );
    setNewPayment({
      date: "",
      pv: "PV",
      pvNo: "",
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
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Payment Management</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Receipt List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Payment List</h2>
          {payments.length > 0 ? (
            <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 border border-gray-300">Date</th>
                <th className="px-4 py-2 border border-gray-300">PV</th>
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
              {payments.map((payment, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="px-4 py-2 border border-gray-300 text-center">{new Date(payment.date).toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-2 border border-gray-300">{payment.pv+payment.pvNo.toString()}</td>
                  <td className="px-4 py-2 border border-gray-300">{payment.particulars}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{payment.cash}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{payment.bank}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{payment.fdr}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{payment.syDr}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{payment.syCr}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{payment.property}</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">{payment.emeJournalFund}</td>
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
                  value={newPayment.rv}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="RV">PV</option>
                  <option value="CE PV">CE RV</option>
                  <option value="BBF">BBF</option>
                </select>
                <input
                  type="text"
                  name="pvNo"
                  value={newPayment.pvNo}
                  onChange={handleInputChange}
                  placeholder={
                    newPayment.rv === "BBF" ? "" : `Enter ${newPayment.pv} number`
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  disabled={newPayment.rv === "BBF"}
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Particulars:</label>
              <input
                type="text"
                name="particulars"
                value={newPayment.particulars}
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
                placeholder="Enter property amount"
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
                Add Payment
              </button>
              <button
                type="submit"
                onClick={handleUpdateReceipt}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Update Payment
              </button>
              <button
                type="submit"
                onClick={handleDeletePayment}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
