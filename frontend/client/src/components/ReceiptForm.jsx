import React, { useContext, useState, useEffect } from 'react';
import AddReceipt from './AddReceipt';
import UpdateReceipt from './UpdateReceipt';
import DeleteReceipt from './DeleteReceipt';
import { AppContext } from '../AppContext/ContextProvider';
import axios from 'axios';
import { getFinancialYear } from '../utils/financialYearHelper';
import { jwtDecode } from "jwt-decode";  // Change this line

const ReceiptForm = () => {
  const { units, setUnits } = useContext(AppContext);  // Add setUnits from context
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Add useEffect to fetch units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/units');
        setUnits(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching units:', error.message || error);
      }
    };
    
    fetchUnits();
  }, [setUnits]);

  const initialState = {
    date: "",  
    voucherType: "",  // Changed from "RV" to empty string
    voucherNo: 0,
    counterVoucherNo: 0, // Keep this in state but remove input field
    particulars: "",
    customParticulars: "",
    receiptType: "",
    customReceiptType: "",
    method: "",
    receiptDescription: "",  // Make sure this is present
    cash: 0,
    bank: 0,
    fdr: 0,
    sydr: 0,
    sycr: 0,
    property: 0,
    eme_journal_fund: 0
  };

  // Update voucher type options array to only include RV and CE PV
  const voucherTypeOptions = [
    { value: "RV", label: "RV (Receipt Voucher)" },
    { value: "CE_PV", label: "CE PV (Corps of Engineers Payment Voucher)" }
  ];

  const receiptTypeOptions = [
    "Interest from Bank",
    "UCS Amount",
    "UCS Amount Dr",
    "Lifetime Subscriptions",
    "Property on Charge",
    "Matured FD",
    "Interest on FD",
    "Custom"
  ];

  const { receipts , setReceipts } = useContext(AppContext);
  const [newReceipt, setNewReceipt] = useState(initialState);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [error, setError] = useState(null);
  const [createCounterVoucher, setCreateCounterVoucher] = useState(true); // Add this state

  const fetchLastVoucherNo = async (date, voucherType) => {
    try {
      if (!date || !voucherType) return;

      const financialYear = getFinancialYear(date);
      const response = await axios.get(
        `http://localhost:5000/api/receipts/lastVoucherNo`, {
          params: {
            year: financialYear,
            voucherType
          }
        }
      );

      const lastVoucherNo = response.data.lastVoucherNo;
      setNewReceipt(prev => ({
        ...prev,
        voucherNo: lastVoucherNo + 1
      }));
    } catch (error) {
      console.error("Error fetching last voucher number:", error);
      setError("Error fetching last voucher number");
    }
  };

  const validateForm = () => {
    if (newReceipt.date==null) {
      setError("Date is required");
      return false;
    }
    if (!newReceipt.particulars) {
      setError("Particulars is required");
      return false; 
    }
    if (!newReceipt.voucherNo) {
      setError("Voucher number is required");
      return false;
    }
    setError(null);
    return true;
  };

  // Remove the hard-coded particularsOptions array and create a computed array from units
  const particularsOptions = [
    ...units.map(unit => unit.nameOfUnit),
    "Custom"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // First update the state with the new value
    setNewReceipt(prev => ({
      ...prev,
      [name]: value
    }));

    // If date or voucherType changed, check if we can fetch the last voucher number
    if (name === 'date' || name === 'voucherType') {
      const updatedDate = name === 'date' ? value : newReceipt.date;
      const updatedVoucherType = name === 'voucherType' ? value : newReceipt.voucherType;
      
      if (updatedDate && updatedVoucherType) {
        fetchLastVoucherNo(updatedDate, updatedVoucherType);
      }
      return;
    }

    if (name === "voucherNo") {
      // Convert string to number for voucherNo
      setNewReceipt(prev => ({
          ...prev,
          [name]: parseInt(value) || 0
      }));
      return;
    }

    if (name === "receiptDescription") {
      setNewReceipt(prev => ({
          ...prev,
          receiptDescription: value
      }));
      return;
   }

  if(name === "particulars") {
    if (value === "Custom") {
        setIsCustomSelected(true);
        setNewReceipt((prev) => ({
            ...prev,
            customParticulars: ""
        }));
    } else {
        setIsCustomSelected(false);
    }
  }

    // Add handling for receipt type
    if (name === "receiptType") {
        if (value !== "Custom") {
            setNewReceipt((prev) => ({
                ...prev,
                receiptType: value,
                customReceiptType: ""
            }));
        } else {
            setNewReceipt((prev) => ({
                ...prev,
                receiptType: value
            }));
        }
    }

    // Handling method selection to show the relevant amount field
    const paymentMethods = ["cash", "bank", "fdr", "syDr", "syCr", "property", "emeJournalFund"];

    if (paymentMethods.includes(name)) {
        // Convert string value to number directly without using toFixed
        const numericValue = Math.round(parseFloat(value) * 100) / 100 || 0;
        setNewReceipt((prev) => ({
            ...prev,
            [name]: numericValue,
            selectedMethod: name
        }));
      } else {
          setNewReceipt((prev) => ({
              ...prev,
              [name]: value
          }));
      }
  };

  const resetForm = () => {
    setNewReceipt(initialState);
    setIsCustomSelected(false);
    setError(null);
  };

  const handleRequestUpdate = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const token = localStorage.getItem('jwtToken'); // Changed from 'token' to 'jwtToken'
      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Use jwtDecode instead of manual decoding
      const decodedToken = jwtDecode(token);
      const username = decodedToken.username;

      const approvalRequest = {
        requestFrom: username,
        requestOn: 'Receipt',
        requestType: 'update',
        details: newReceipt,
        status: 'pending'  // Added status explicitly
      };

      const response = await axios.post('http://localhost:5000/api/approvalsRoute', approvalRequest);
      
      if (response.status === 201) {
        alert('Update request sent for approval');
        resetForm();
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
        requestOn: 'Receipt',
        requestType: 'delete',
        details: newReceipt,
        status: 'pending'
      };

      const response = await axios.post('http://localhost:5000/api/approvals', approvalRequest);
      
      if (response.status === 201) {
        alert('Delete request sent for approval');
        resetForm();
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Error sending delete request');
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
          <label className="block text-gray-700 font-medium mb-1">Voucher Type:</label>
          <select 
            name="voucherType" 
            value={newReceipt.voucherType} 
            onChange={handleInputChange} 
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select Voucher Type</option>
            {voucherTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Voucher Number:</label>
            <input
              type="number"
              name="voucherNo"
              value={newReceipt.voucherNo || ""}
              onChange={handleInputChange}
              placeholder="Enter Voucher Number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Particulars:</label>
          <select
            name="particulars"
            value={newReceipt.particulars}
            onChange={handleInputChange}
            className="w-1/2 border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select Particulars</option>
            {particularsOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {isCustomSelected && (
            <input
              type="text"
              name="customParticulars"
              value={newReceipt.customParticulars}
              onChange={handleInputChange}
              placeholder="Enter custom particulars"
              className="w-1/2 border border-gray-300 rounded-lg px-4 py-2"
            />
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Receipt Type:</label>
          <select
              name="receiptType"
              value={newReceipt.receiptType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
              <option value="">Select Receipt Type</option>
              {receiptTypeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
              ))}
          </select>
          {newReceipt.receiptType === "Custom" && (
              <input
                  type="text"
                  name="customReceiptType"
                  value={newReceipt.customReceiptType}
                  onChange={handleInputChange}
                  placeholder="Enter custom receipt type"
                  className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2"
              />
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Method:</label>
          <select name="method" value={newReceipt.method} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2">
            <option value="">Select Type</option>
            <option value="none">None</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="fdr">FDR</option>
            <option value="sydr">SYDR</option>
            <option value="sycr">SY CR</option>
            <option value="property">Property</option>
            <option value="eme_journal_fund">EME Journal Fund</option>
          </select>
        </div>
        {(newReceipt.method === 'cash' || newReceipt.method === 'bank' || newReceipt.method === 'fdr' || newReceipt.method === 'sydr' || newReceipt.method === 'sycr' || newReceipt.method === 'property' || newReceipt.method === 'eme_journal_fund') && (
          <div>
            <label className="block text-gray-700 font-medium mb-1">Amount:</label>
            <input type="number" name={newReceipt.method} value={newReceipt[newReceipt.method]||""} onChange={handleInputChange} placeholder="Enter Amount" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
        )}
        <div>
            <label className="block text-gray-700 font-medium mb-1">Receipt Description:</label>
            <input
                type="text"
                name="receiptDescription"
                value={newReceipt.receiptDescription}
                onChange={handleInputChange}
                placeholder="Enter Receipt Description"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={createCounterVoucher}
              onChange={(e) => setCreateCounterVoucher(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="text-gray-700">Create Counter Voucher</span>
          </label>
        </div>

        <div className="flex space-x-4 mt-4">
          <AddReceipt 
            newReceipt={newReceipt} 
            createCounterVoucher={createCounterVoucher}
            onSuccess={() => {
              resetForm();
            }}
            validateForm={validateForm}
          />
          {user?.toggler !== "Clerk" && (
            <UpdateReceipt 
              newReceipt={newReceipt}
              onSuccess={() => {
                resetForm();
              }}
              validateForm={validateForm}
            />
          )}
          {user?.toggler !== "Clerk" && (
            <DeleteReceipt 
              newReceipt={newReceipt}
              onSuccess={() => {
                resetForm();
              }}
              validateForm={validateForm}
            />
          )}
          {["Clerk"].includes(user?.toggler) && (
            <button
              onClick={handleRequestUpdate}
              className="bg-green-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-110 transition-transform duration-200"
              type="button"
            >
              Request Update
            </button>
          )}
          {["Clerk"].includes(user?.toggler) && (
            <button
              onClick={handleRequestDelete}
              className="bg-red-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:scale-110 transition-transform duration-200"
              type="button"
            >
              Request Delete
            </button>
          )}
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