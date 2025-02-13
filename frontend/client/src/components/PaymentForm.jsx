import React, { useState } from 'react';
import AddPayment from './AddPayment';
import UpdatePayment from './UpdatePayment';
import DeletePayment from './DeletePayment';

const PaymentForm = () => {
  const initialState = {
    date: "",
    voucherType: "PV",
    voucherNo: "",
    particulars: "",
    customParticulars: "",
    paymentType: "",
    customPaymentType: "",
    method: "",
    paymentDescription: "",
    cash: 0,
    bank: 0,
    fdr: 0,
    syDr: 0,
    syCr: 0,
    property: 0,
    emeJournalFund: 0,
  };

  const paymentTypeOptions = [
    "Bank Adjustment",
    "Petty Cash Amount",
    "Petty Cash Expenditure",
    "Payment for EME Journal",
    "Purchase",
    "FD",
    "Appreciation Amount",
    "Interest on FD",
    "Depreciation Amount",
    "Waveoff",
    "Bank Charges",
    "Custom"
  ];

  const [newPayment, setNewPayment] = useState(initialState);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [error, setError] = useState(null);

  const validateForm = () => {
    if (!newPayment.date) {
      setError("Date is required");
      return false;
    }
    if (!newPayment.particulars) {
      setError("Particulars is required");
      return false;
    }
    if (!newPayment.voucherNo) {
      setError("Voucher Number is required");
      return false;
    }
    setError(null);
    return true;
  };

  const particularsOptions = [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Custom"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "voucherNo") {
      setNewPayment(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
      return;
    }

    if (name === "paymentDescription") {
      setNewPayment(prev => ({
        ...prev,
        paymentDescription: value
      }));
      return;
    }

    if (name === "particulars") {
      if (value === "Custom") {
        setIsCustomSelected(true);
        setNewPayment((prev) => ({
          ...prev,
          customParticulars: ""
        }));
      } else {
        setIsCustomSelected(false);
      }
    }

    if (name === "paymentType") {
      if (value !== "Custom") {
        setNewPayment((prev) => ({
          ...prev,
          paymentType: value,
          customPaymentType: ""
        }));
      } else {
        setNewPayment((prev) => ({
          ...prev,
          paymentType: value
        }));
      }
    }

    const paymentMethods = ["cash", "bank", "fdr", "syDr", "syCr", "property", "emeJournalFund"];

    if (paymentMethods.includes(name)) {
      const numericValue = Math.round(parseFloat(value) * 100) / 100 || 0;
      setNewPayment((prev) => ({
        ...prev,
        [name]: numericValue,
        selectedMethod: name
      }));
    } else {
      setNewPayment((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setNewPayment(initialState);
    setIsCustomSelected(false);
    setError(null);
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
              name="voucherType"
              value={newPayment.voucherType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="PV">PV</option>
              <option value="CE RV">CE RV</option>
            </select>
            <input
              type="text"
              name="voucherNo"
              value={newPayment.voucherNo}
              onChange={handleInputChange}
              placeholder={`Enter ${newPayment.voucherType} number`}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
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
          <label className="block text-gray-700 font-medium mb-1">Payment Type:</label>
          <select
            name="paymentType"
            value={newPayment.paymentType}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select Payment Type</option>
            {paymentTypeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {newPayment.paymentType === "Custom" && (
            <input
              type="text"
              name="customPaymentType"
              value={newPayment.customPaymentType}
              onChange={handleInputChange}
              placeholder="Enter custom payment type"
              className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Method:</label>
          <select name="method" value={newPayment.method} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2">
            <option value="">Select Type</option>
            <option value="none">None</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="fdr">FDR</option>
            <option value="syDr">SYDR</option>
            <option value="syCr">SY CR</option>
            <option value="property">Property</option>
            <option value="emeJournalFund">EME Journal Fund</option>
          </select>
        </div>
        {(newPayment.method === 'cash' || newPayment.method === 'bank' || newPayment.method === 'fdr' || newPayment.method === 'syDr' || newPayment.method === 'syCr' || newPayment.method === 'property' || newPayment.method === 'emeJournalFund') && (
          <div>
            <label className="block text-gray-700 font-medium mb-1">Amount:</label>
            <input type="number" name={newPayment.method} value={newPayment[newPayment.method]||""} onChange={handleInputChange} placeholder="Enter Amount" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
        )}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Payment Description:</label>
          <input
            type="text"
            name="paymentDescription"
            value={newPayment.paymentDescription}
            onChange={handleInputChange}
            placeholder="Enter Payment Description"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div className="flex space-x-4">
          <AddPayment newPayment={newPayment} onSuccess={resetForm} validateForm={validateForm} />
          <UpdatePayment newPayment={newPayment} onSuccess={resetForm} validateForm={validateForm} />
          <DeletePayment 
            newPayment={newPayment}
            onSuccess={resetForm}
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

export default PaymentForm;