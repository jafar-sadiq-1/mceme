import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import FDRForm from "../components/FDRForm";
import { AppContext } from "../AppContext/ContextProvider";
import Header from '../components/Header';
import * as XLSX from 'xlsx';
import {jwtDecode} from 'jwt-decode';

export default function FDRPage() {
  const { fdrs, setFdrs } = useContext(AppContext);
  const [search, setSearch] = useState('');
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

  const handlePrint = () => {
    const printContents = document.getElementById("printable-area").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print FDR Details</title>
          <style>
            @media print {
              body::before {
                content: "EME Journal";
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-30deg);
                font-size: 80px;
                font-weight: bold;
                color: rgba(0, 0, 0, 0.1);
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
              }
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleExcelExport = () => {
    const excelData = fdrs.map(fdr => ({
      'FDR No': fdr.fdrNo,
      'Date of Deposit': new Date(fdr.dateOfDeposit).toLocaleDateString("en-GB"),
      'Amount': fdr.amount,
      'Maturity Value': fdr.maturityValue,
      'Maturity Date': new Date(fdr.maturityDate).toLocaleDateString("en-GB"),
      'Duration': fdr.duration,
      'Int Rate %': fdr.intRate,
      'Interest Amount': fdr.interestAmount,
      'Bank': fdr.bank,
      'Remarks': fdr.remarks || ''
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'FDRs');
    XLSX.writeFile(wb, `FDR_Details_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <>
      <Header/>
      <div className="p-6 bg-gradient-to-r from-teal-100 to-violet-100" style={{ fontFamily: 'Times New Roman, serif' }}>
        <div className="bg-white shadow-md rounded-lg p-6">
        <div id="printable-area">
          <h2 className="text-3xl mb-4 text-center" style={{ color: '#6A1D8F' }}>FDR Details</h2>
            <table className="table-auto w-full border-collapse border border-black">
              <thead>
                <tr className="bg-violet-500 text-black">
                  <th className="px-4 py-2 border border-black">S No</th>
                  <th className="px-4 py-2 border border-black">FDR No</th>
                  <th className="px-4 py-2 border border-black">Date of Deposit</th>
                  <th className="px-4 py-2 border border-black">Amount</th>
                  <th className="px-4 py-2 border border-black">Maturity Value</th>
                  <th className="px-4 py-2 border border-black">Maturity Date</th>
                  <th className="px-4 py-2 border border-black">Duration</th>
                  <th className="px-4 py-2 border border-black">Int Rate %</th>
                  <th className="px-4 py-2 border border-black">Interest Amount</th>
                  <th className="px-4 py-2 border border-black">Bank</th>
                  <th className="px-4 py-2 border border-black">Bank Remarks</th>
                </tr>
              </thead>
              <tbody>
                {fdrs.map((fdr, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-violet-50' : 'bg-white'}>
                    <td className="px-4 py-2 border border-black text-center">{index + 1}</td>
                    <td className="px-4 py-2 border border-black">{fdr.fdrNo}</td>
                    <td className="px-4 py-2 border border-black text-center">{new Date(fdr.dateOfDeposit).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-2 border border-black text-right">{fdr.amount.toLocaleString()}</td>
                    <td className="px-4 py-2 border border-black text-right">{fdr.maturityValue.toLocaleString()}</td>
                    <td className="px-4 py-2 border border-black text-center">{new Date(fdr.maturityDate).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-2 border border-black text-center">{fdr.duration}</td>
                    <td className="px-4 py-2 border border-black text-right">{fdr.intRate}%</td>
                    <td className="px-4 py-2 border border-black text-right">{fdr.interestAmount.toLocaleString()}</td>
                    <td className="px-4 py-2 border border-black text-center">{fdr.bank}</td>
                    <td className="px-4 py-2 border border-black">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border border-black rounded"
                        placeholder="Enter remarks"
                        value={fdr.remarks || ''}
                        onChange={(e) => {
                          const newRemark = e.target.value;
                          setFdrs(prevData => prevData.map(item => item.fdrNo === fdr.fdrNo ? { ...item, remarks: newRemark } : item));
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <button onClick={handlePrint} className="bg-green-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-110 transition-transform duration-200">
              Print
            </button>
            <button onClick={handleExcelExport} className="bg-blue-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition-transform duration-200">
              Export to Excel
            </button>
          </div>
          {user && user.toggler !== "Viewer" && <FDRForm/>}
        </div>
      </div>
    </>
  );
}