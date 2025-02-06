import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import FDRForm from "../components/FDRForm";
import { AppContext } from "../AppContext/ContextProvider";

export default function FDRPage() {
  const { fdrs, setFdrs } = useContext(AppContext);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchFdrs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fdr');
        setFdrs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching FDRs:', error.message || error);
      }
    };

    fetchFdrs();
  }, [setFdrs]);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const filteredFdrs = Array.isArray(fdrs)
    ? fdrs.filter((fdr) =>
        fdr.fdrNo && fdr.fdrNo.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleRemarksChange = (fdrNo, newRemark) => {
    setFdrs((prevData) =>
      prevData.map((fdr) =>
        fdr.fdrNo === fdrNo ? { ...fdr, remarks: newRemark } : fdr
      )
    );
  };

  // Function to check if the FDR is matured
  const isMatured = (maturityDate) => {
    const currentDate = new Date();
    const maturityDateObj = new Date(maturityDate);
    return currentDate >= maturityDateObj;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">FDR Page</h2>
      
      {/* Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="p-2 border rounded w-2/3"
          placeholder="Search by FDR No"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Display filtered FDRs */}
      <div className="mt-8">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border-b">S.No</th>
              <th className="px-4 py-2 border-b">FDR No</th>
              <th className="px-4 py-2 border-b">Date of Deposit</th>
              <th className="px-4 py-2 border-b">Amount</th>
              <th className="px-4 py-2 border-b">Maturity Value</th>
              <th className="px-4 py-2 border-b">Maturity Date</th>
              <th className="px-4 py-2 border-b">Duration</th>
              <th className="px-4 py-2 border-b">Int Rate %</th>
              <th className="px-4 py-2 border-b">Interest Amount</th>
              <th className="px-4 py-2 border-b">Bank</th>
              <th className="px-4 py-2 border-b">Status</th> {/* New column for status */}
              <th className="px-4 py-2 border-b">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredFdrs.map((fdr, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{fdr.fdrNo}</td>
                <td className="px-4 py-2 border-b">{new Date(fdr.dateOfDeposit).toLocaleDateString("en-GB")}</td>
                <td className="px-4 py-2 border-b text-right">{fdr.amount.toLocaleString()}</td>
                <td className="px-4 py-2 border-b text-right">{fdr.maturityValue.toLocaleString()}</td>
                <td className="px-4 py-2 border-b text-center">{new Date(fdr.maturityDate).toLocaleDateString("en-GB")}</td>
                <td className="px-4 py-2 border-b text-center">{fdr.duration}</td>
                <td className="px-4 py-2 border-b text-right">{fdr.intRate}%</td>
                <td className="px-4 py-2 border-b text-right">{fdr.interestAmount.toLocaleString()}</td>
                <td className="px-4 py-2 border-b text-center">{fdr.bank}</td>
                <td className="px-4 py-2 border-b text-center">
                  {/* Displaying "Matured" or "Not Matured" based on maturity date */}
                  {isMatured(fdr.maturityDate) ? (
                    <span className="text-green-500">Matured</span>
                  ) : (
                    <span className="text-red-500">Not Matured</span>
                  )}
                </td>
                <td className="px-4 py-2 border-b">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    value={fdr.remarks}
                    onChange={(e) => handleRemarksChange(fdr.fdrNo, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FDRForm /> {/* Your form to add new FDR */}
    </div>
  );
}
