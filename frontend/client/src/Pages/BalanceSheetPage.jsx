import React, { useEffect, useState } from "react";
import Header from '../components/Header';
import axios from 'axios';
import { getFinancialYearsList, getCurrentFinancialYear } from '../utils/financialYearHelper';
import * as XLSX from 'xlsx';

export default function BalanceSheet() {
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear());
  const [selectedMonth, setSelectedMonth] = useState('');

  const financialYears = getFinancialYearsList(10);
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const months = monthNames.map((month, index) => ({ number: index + 1, name: month }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receiptTotals, setReceiptTotals] = useState({
    cash: 0,
    bank: 0,
    fdr: 0,
    sydr: 0,
    sycr: 0,
    property: 0,
    eme_journal_fund: 0
  });
  const [paymentTotals, setPaymentTotals] = useState({
    cash: 0,
    bank: 0,
    fdr: 0,
    syDr: 0,
    syCr: 0,
    property: 0,
    emeJournalFund: 0
  });

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
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
        mix-blend-mode: multiply; /* Ensures it blends with table background */
      }
    }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style); // Cleanup
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch both receipts and payments
        const [receiptsResponse, paymentsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/receipts', {
            params: { year: selectedFY, month: selectedMonth }
          }),
          axios.get('http://localhost:5000/api/payments', {
            params: { year: selectedFY, month: selectedMonth }
          })
        ]);

        // Calculate receipt totals
        const rTotals = receiptsResponse.data.reduce((acc, receipt) => ({
          cash: acc.cash + (Number(receipt.cash) || 0),
          bank: acc.bank + (Number(receipt.bank) || 0),
          fdr: acc.fdr + (Number(receipt.fdr) || 0),
          sydr: acc.sydr + (Number(receipt.sydr) || 0),
          sycr: acc.sycr + (Number(receipt.sycr) || 0),
          property: acc.property + (Number(receipt.property) || 0),
          eme_journal_fund: acc.eme_journal_fund + (Number(receipt.eme_journal_fund) || 0),
        }), { cash: 0, bank: 0, fdr: 0, sydr: 0, sycr: 0, property: 0, eme_journal_fund: 0 });

        // Calculate payment totals
        const pTotals = paymentsResponse.data.reduce((acc, payment) => ({
          cash: acc.cash + (Number(payment.cash) || 0),
          bank: acc.bank + (Number(payment.bank) || 0),
          fdr: acc.fdr + (Number(payment.fdr) || 0),
          syDr: acc.syDr + (Number(payment.syDr) || 0),
          syCr: acc.syCr + (Number(payment.syCr) || 0),
          property: acc.property + (Number(payment.property) || 0),
          emeJournalFund: acc.emeJournalFund + (Number(payment.emeJournalFund) || 0),
        }), { cash: 0, bank: 0, fdr: 0, syDr: 0, syCr: 0, property: 0, emeJournalFund: 0 });

        setReceiptTotals(rTotals);
        setPaymentTotals(pTotals);

      } catch (error) {
        setError("Failed to fetch data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFY, selectedMonth]);

  // Calculate balance sheet entries
  const assets = [
    { 
      name: "Cash in Hand", 
      amount: Math.abs(receiptTotals.cash - paymentTotals.cash)
    },
    { 
      name: "Cash in Bank", 
      amount: Math.abs(receiptTotals.bank - paymentTotals.bank)
    },
    { 
      name: "FDR", 
      amount: Math.abs(receiptTotals.fdr - paymentTotals.fdr)
    },
    { 
      name: "Sy Dr", 
      amount: Math.abs(receiptTotals.sydr - paymentTotals.syDr)
    },
    { 
      name: "Property", 
      amount: Math.abs(receiptTotals.property - paymentTotals.property)
    }
  ];

  const liabilities = [
    { 
      name: "EME Journal Fund", 
      amount: Math.abs(receiptTotals.eme_journal_fund - paymentTotals.emeJournalFund)
    },
    { 
      name: "Property", 
      amount: Math.abs(receiptTotals.property - paymentTotals.property)
    },
    { 
      name: "Sy Cr", 
      amount: Math.abs(receiptTotals.sycr - paymentTotals.syCr)
    }
  ];

  const maxRows = Math.max(assets.length, liabilities.length);

  // Calculate totals for footer row
  const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0);

  const handlePrint = () => {
    const printContents = document.getElementById("print").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = `
      <!DOCTYPE html>
      <html>
        <body>
          ${printContents}
        </body>
      </html>
    `;
    window.print();
    document.body.innerHTML = originalContents; // Restore after printing
    window.location.reload(); // Ensure scripts reattach after print
  };

  const handleExcelExport = () => {
    const excelData = [];
    const maxRows = Math.max(assets.length, liabilities.length);

    for (let i = 0; i < maxRows; i++) {
      excelData.push({
        'Assets': assets[i]?.name || '',
        'Amount': assets[i]?.amount || '',
        'Liabilities': liabilities[i]?.name || '',
        'Amount.1': liabilities[i]?.amount || ''
      });
    }

    // Add totals row
    excelData.push({
      'Assets': 'Total',
      'Amount': totalAssets,
      'Liabilities': 'Total',
      'Amount.1': totalLiabilities
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Balance Sheet');
    XLSX.writeFile(wb, `Balance_Sheet_${selectedFY}_${selectedMonth || 'All'}.xlsx`);
  };

  let heading = "Balance Sheet";
  if (selectedFY && selectedMonth) {
    heading = `Balance Sheet for ${selectedMonth} ${selectedFY}`;
  } else if (selectedFY) {
    heading = `Balance Sheet for ${selectedFY}`;
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-violet-100 font-serif">
      <Header/>
      <div className="mb-8 flex justify-center mt-11">
        <div className="bg-white shadow-md rounded-lg p-6 w-auto">
          {/* Move filters inside the white box */}
          <div className="mb-6 flex justify-center">
            <div className="flex space-x-4">
              <select
                className="border px-4 py-2 rounded-lg"
                value={selectedFY}
                onChange={(e) => setSelectedFY(e.target.value)}
              >
                {financialYears.map((fy) => (
                  <option key={fy} value={fy}>{fy}</option>
                ))}
              </select>

              <select
                className="border px-4 py-2 rounded-lg"
                value={selectedMonth || ""}
                onChange={(e) => setSelectedMonth(e.target.value || null)}
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month.number} value={month.name}>{month.name}</option>
                ))}
              </select>
            </div>
          </div>

          {loading && <div className="text-center mb-4">Loading...</div>}
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          <div id="print">
            <h2 className="text-2xl font-bold text-black mb-4 text-center">
              {heading}
            </h2>
            <table className="table-auto w-full border-collapse border border-gray-300" style={{ fontFamily: 'Times New Roman, serif' }}>
              <thead>
                <tr className="bg-violet-400 text-black">
                  <th className="px-4 py-2 border border-gray-300">Assets</th>
                  <th className="px-4 py-2 border border-gray-300">Amount</th>
                  <th className="px-4 py-2 border border-gray-300">Liabilities</th>
                  <th className="px-4 py-2 border border-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxRows }).map((_, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-violet-50' : 'bg-white'}
                  >
                    {/* Assets */}
                    <td className="px-4 py-2 border border-gray-300">
                      {assets[index]?.name || ""}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-right">
                      {assets[index]?.amount?.toLocaleString() || ""}
                    </td>
                    {/* Liabilities */}
                    <td className="px-4 py-2 border border-gray-300">
                      {liabilities[index]?.name || ""}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-right">
                      {liabilities[index]?.amount?.toLocaleString() || ""}
                    </td>
                  </tr>
                ))}
                <tr className="bg-violet-200 font-bold">
                  <td className="px-4 py-2 border border-gray-300">Total</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">
                    {totalAssets.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">Total</td>
                  <td className="px-4 py-2 border border-gray-300 text-right">
                    {totalLiabilities.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6 gap-4">
        <button onClick={handlePrint} className="bg-green-500 border border-black text-black px-4 py-2 rounded hover:bg-green-600 hover:scale-110 transition-transform duration-200">
          Print
        </button>
        <button onClick={handleExcelExport} className="bg-blue-500 border border-black text-black px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 transition-transform duration-200">
          Export to Excel
        </button>
      </div>
    </div>
    </>
  );
}