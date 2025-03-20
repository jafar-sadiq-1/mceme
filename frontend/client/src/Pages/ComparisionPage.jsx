import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from 'axios';
import { getFinancialYearsList, getCurrentFinancialYear } from '../utils/financialYearHelper';

const ComparisionPage = () => {
  
  const [selectedFY1, setSelectedFY1] = useState(getCurrentFinancialYear());
  const [selectedMonth1, setSelectedMonth1] = useState('');
  const [selectedFY2, setSelectedFY2] = useState(getCurrentFinancialYear());
  const [selectedMonth2, setSelectedMonth2] = useState('');
  const [leftReceipts, setLeftReceipts] = useState({});
  const [leftPayments, setLeftPayments] = useState({});
  const [rightReceipts, setRightReceipts] = useState({});
  const [rightPayments, setRightPayments] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const financialYears = getFinancialYearsList(10); // Get last 10 financial years

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Run API calls in parallel for better performance
        const [leftReceiptsRes, leftPaymentsRes, rightReceiptsRes, rightPaymentsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/receipts", {
            params: { year: selectedFY1, month: selectedMonth1 }
          }),
          axios.get("http://localhost:5000/api/payments", {
            params: { year: selectedFY1, month: selectedMonth1 }
          }),
          axios.get("http://localhost:5000/api/receipts", {
            params: { year: selectedFY2, month: selectedMonth2 }
          }),
          axios.get("http://localhost:5000/api/payments", {
            params: { year: selectedFY2, month: selectedMonth2 }
          })
        ]);

        // Process data using the same reducer logic
        const leftReceiptsData = leftReceiptsRes.data.reduce((acc, receipt) => ({
          cash: acc.cash + (Number(receipt.cash) || 0),
          bank: acc.bank + (Number(receipt.bank) || 0),
          fdr: acc.fdr + (Number(receipt.fdr) || 0),
          sydr: acc.sydr + (Number(receipt.sydr) || 0),
          sycr: acc.sycr + (Number(receipt.sycr) || 0),
          property: acc.property + (Number(receipt.property) || 0),
          eme_journal_fund: acc.eme_journal_fund + (Number(receipt.eme_journal_fund) || 0),
        }), {
          cash: 0, bank: 0, fdr: 0, sydr: 0, sycr: 0, property: 0, eme_journal_fund: 0
        });
        const leftPaymentsData = leftPaymentsRes.data.reduce((acc, payment) => ({
          cash: acc.cash + (Number(payment.cash) || 0),
          bank: acc.bank + (Number(payment.bank) || 0),
          fdr: acc.fdr + (Number(payment.fdr) || 0),
          sydr: acc.sydr + (Number(payment.sydr) || 0),
          sycr: acc.sycr + (Number(payment.sycr) || 0),
          property: acc.property + (Number(payment.property) || 0),
          eme_journal_fund: acc.eme_journal_fund + (Number(payment.eme_journal_fund) || 0),
        }), {
          cash: 0, bank: 0, fdr: 0, sydr: 0, sycr: 0, property: 0, eme_journal_fund: 0
        });
        const rightReceiptsData = rightReceiptsRes.data.reduce((acc, receipt) => ({
          cash: acc.cash + (Number(receipt.cash) || 0),
          bank: acc.bank + (Number(receipt.bank) || 0),
          fdr: acc.fdr + (Number(receipt.fdr) || 0),
          sydr: acc.sydr + (Number(receipt.sydr) || 0),
          sycr: acc.sycr + (Number(receipt.sycr) || 0),
          property: acc.property + (Number(receipt.property) || 0),
          eme_journal_fund: acc.eme_journal_fund + (Number(receipt.eme_journal_fund) || 0),
        }), {
          cash: 0, bank: 0, fdr: 0, sydr: 0, sycr: 0, property: 0, eme_journal_fund: 0
        });
        const rightPaymentsData = rightPaymentsRes.data.reduce((acc, payment) => ({
          cash: acc.cash + (Number(payment.cash) || 0),
          bank: acc.bank + (Number(payment.bank) || 0),
          fdr: acc.fdr + (Number(payment.fdr) || 0),
          sydr: acc.sydr + (Number(payment.sydr) || 0),
          sycr: acc.sycr + (Number(payment.sycr) || 0),
          property: acc.property + (Number(payment.property) || 0),
          eme_journal_fund: acc.eme_journal_fund + (Number(payment.eme_journal_fund) || 0),
        }), {
          cash: 0, bank: 0, fdr: 0, sydr: 0, sycr: 0, property: 0, eme_journal_fund: 0
        });

        setLeftReceipts(leftReceiptsData);
        setLeftPayments(leftPaymentsData);
        setRightReceipts(rightReceiptsData);
        setRightPayments(rightPaymentsData);

      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedMonth1 && selectedMonth2) {
      fetchData();
    }
  }, [selectedFY1, selectedMonth1, selectedFY2, selectedMonth2]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const months = monthNames.map((month, index) => ({ number: index + 1, name: month }));

  const leftfunds = [
    { name: "Cash in Hand", assets:leftReceipts.cash-leftPayments.cash, liabilities: 0.00, income: 0.00, expenditure: 0.00 },
    { name: "Cash in Bank", assets: leftReceipts.bank-leftPayments.bank, liabilities: 0.00, income: 0.00, expenditure: 0.00 },
    { name: "FDRs", assets: leftReceipts.fdr-leftPayments.fdr, liabilities: 0.00, income: 0.00, expenditure: 0.00 },
    { name: "Sy Dr", assets: leftReceipts.sydr-leftPayments.sydr, liabilities: 0.00, income: 0.00, expenditure: 0.00 },
    { name: "Property", assets: leftReceipts.property-leftPayments.property, liabilities: leftReceipts.property-leftPayments.property, income: 0.00, expenditure: 0.00 },
    { name: "EME Journal", assets: 0.00, liabilities: leftReceipts.eme_journal_fund-leftPayments.eme_journal_fund, income: 0.00, expenditure: 0.00 },
  ];

  const rightfunds=[
    { name: "Cash in Hand", assets:rightReceipts.cash-rightPayments.cash, liabilities: 0.00, income: 0.00, expenditure: 0.00 },
    { name: "Cash in Bank", assets: rightReceipts.bank-rightPayments.bank, liabilities: 0.00, income: 0.00, expenditure: 0.00 },
    { name: "FDRs", assets: rightReceipts.fdr-rightPayments.fdr, liabilities: 0.00, income: 0.00, expenditure: 0.00 },
    { name: "Sy Dr", assets: rightReceipts.sydr-rightPayments.sydr, liabilities: 0.00, income: 0.00, expenditure: 0.00 },
    { name: "Property", assets: rightReceipts.property-rightPayments.property, liabilities: rightReceipts.property-rightPayments.property, income: 0.00, expenditure: 0.00 },
    { name: "EME Journal", assets:0.00 , liabilities: rightReceipts.eme_journal_fund-rightPayments.eme_journal_fund, income: 0.00, expenditure: 0.00 },
  ];

  const handlePrint = () => {
    const printContents = document.getElementById("balanceSheet").innerHTML;
    const originalContents = document.body.innerHTML;
  
    document.body.innerHTML = `
      <!DOCTYPE html>
      <html>
        <head>
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
                color: rgba(0, 0, 0, 0.05);
                z-index: -1;
                pointer-events: none;
                white-space: nowrap;
              }
            }
            table {
              width: 100%;
              border-collapse: collapse;
              border-spacing: 0;
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
    document.body.innerHTML = originalContents; // Restore after printing
    window.location.reload(); // Ensure scripts reattach after print
  };

  return (
    <>
      <Header />
      <div className="p-6 min-h-screen bg-gradient-to-r from-teal-100 to-violet-100" style={{ fontFamily: "Times New Roman, serif" }}>
        <div className="mb-6 flex space-x-4 justify-center">
          <div>
            <select
              className="border px-4 py-2 rounded-lg"
              value={selectedFY1}
              onChange={(e) => setSelectedFY1(e.target.value)}
            >
              {financialYears.map((fy) => (
                <option key={fy} value={fy}>{fy}</option>
              ))}
            </select>
            <select
              className="border px-4 py-2 rounded-lg"
              value={selectedMonth1 || ""}
              onChange={(e) => setSelectedMonth1(e.target.value || null)}
            >
              <option value="">Select Month</option>
              {months.map((month) => (
                <option key={month.number} value={month.name}>{month.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="border px-4 py-2 rounded-lg"
              value={selectedFY2}
              onChange={(e) => setSelectedFY2(e.target.value)}
            >
              {financialYears.map((fy) => (
                <option key={fy} value={fy}>{fy}</option>
              ))}
            </select>
            <select
              className="border px-4 py-2 rounded-lg"
              value={selectedMonth2 || ""}
              onChange={(e) => setSelectedMonth2(e.target.value || null)}
            >
              <option value="">Select Month</option>
              {months.map((month) => (
                <option key={month.number} value={month.name}>{month.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {loading && (
          <div className="text-center py-4">
            <p>Loading data...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4 text-red-500">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="mt-8 mb-8 flex justify-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-auto">
              <div id="balanceSheet">
                <h1 className="text-center text-2xl font-bold mb-6">Balance Sheet Comparison</h1>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full border border-gray-700" style={{ tableLayout: "auto" }}>
                    <thead className="bg-violet-400 text-black">
                      <tr>
                        <th className="border border-black max-w-[50px]">S No</th>
                        <th className="border border-black max-w-[150px]">Name of Fund</th>
                        <th className="border border-black p-0.5 w-[250px]">
                          Bal for the Month <br />({selectedMonth1} {selectedFY1})
                          <div className="grid grid-cols-2 divide-x divide-black mt-1">
                            <span className="text-center">Assets (Rs)</span>
                            <span className="text-center">Liabilities (Rs)</span>
                          </div>
                        </th>
                        <th className="border border-black p-0.5 max-w-[80px]">Income in Present Month (Rs)</th>
                        <th className="border border-black p-0.5 max-w-[80px]">Expdr in Present Month (Rs)</th>
                        <th className="border border-black p-0.5 w-[250px]">
                          Bal for the Month <br />({selectedMonth2} {selectedFY2})
                          <div className="grid grid-cols-2 divide-x divide-black mt-1">
                            <span className="text-center">Assets (Rs)</span>
                            <span className="text-center">Liabilities (Rs)</span>
                          </div>
                        </th>
                        <th className="border border-black p-0.5 max-w-[100px]">Incr (+)</th>
                        <th className="border border-black p-0.5 max-w-[100px]">Decr (-)</th>
                        <th className="border border-black p-0.5 max-w-[100px]">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leftfunds.map((fund, index) => (
                        <tr key={index} className="text-center">
                          <td className="border border-black p-0.5">{index + 1}</td>
                          <td className="border border-black p-0.5">{fund.name}</td>
                          <td className="border border-black p-0.5 w-[200px]">
                            <div className="grid grid-cols-2 divide-x divide-black">
                              <span className="text-center">{fund.assets.toFixed(2)}</span>
                              <span className="text-center">{fund.liabilities.toFixed(2)}</span>
                            </div>
                          </td>
                          <td className="border border-black p-0.5 w-[80px]">{fund.income.toFixed(2)}</td>
                          <td className="border border-black p-0.5 w-[80px]">{fund.expenditure.toFixed(2)}</td>
                          <td className="border border-black p-0.5 w-[200px]">
                            <div className="grid grid-cols-2 divide-x divide-black">
                              <span className="text-center">{rightfunds[index]?.assets.toFixed(2) || '0.00'}</span>
                              <span className="text-center">{rightfunds[index]?.liabilities.toFixed(2) || '0.00'}</span>
                            </div>
                          </td>
                          <td className="border border-black p-0.5 w-[120px]">
                            {Math.max(
                              ((rightfunds[index]?.assets - rightfunds[index]?.liabilities) - 
                              (fund.assets - fund.liabilities)),
                              0
                            ).toFixed(2)}
                          </td>
                          <td className="border border-black p-0.5 w-[120px]">
                            {Math.max(
                              ((fund.assets - fund.liabilities) - 
                              (rightfunds[index]?.assets - rightfunds[index]?.liabilities)),
                              0
                            ).toFixed(2)}
                          </td>
                          <td className="border border-black p-0.5">
                            <input type="text" placeholder="Enter remarks" className="border border-black px-0.5 py-0.5 w-full" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button onClick={handlePrint} className="bg-green-500 border border-black text-black px-4 py-2 rounded hover:bg-green-600 hover:scale-110 transition-transform duration-200">
            Print
          </button>
        </div>
      </div>
    </>
  );
};

export default ComparisionPage;