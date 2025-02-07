import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import FDRForm from "../components/FDRForm";
import { AppContext } from "../AppContext/ContextProvider";
import Header from '../components/Header';

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
  <>
    <Header/>
    <div className="p-6 bg-gradient-to-r from-teal-100 to-violet-100"style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl mb-4  text-center" style={{ color: '#6A1D8F' }}>FDR Details</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-violet-600 text-black">
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
            {filteredFdrs.map((fdr, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-violet-50' : 'bg-white'}>
                <td className="px-4 py-2 border border-gray-300 text-center">{index + 1}</td>
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
                <td className="px-4 py-2 border border-gray-300 text-center">{fdr.duration}</td>
                <td className="px-4 py-2 border border-gray-300 text-right">{fdr.intRate}%</td>
                <td className="px-4 py-2 border border-gray-300 text-right">
                  {fdr.interestAmount.toLocaleString()}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-center">{fdr.bank}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    placeholder="Enter remarks"
                    value={fdr.remarks}
                    onChange={(e) => handleRemarksChange(fdr.fdrNo, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <FDRForm/>
      </div>
    </div>
  </>
  );
}
