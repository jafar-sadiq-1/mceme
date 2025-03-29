import { useContext, useState, useEffect, useRef, useCallback } from "react";
import Header from "../components/Header"; // This line already exists in your code
import { AppContext } from "../AppContext/ContextProvider";
import ReceiptForm from "../components/ReceiptForm";
import axios from 'axios';
import { getCurrentFinancialYear } from '../utils/financialYearHelper';
import * as XLSX from 'xlsx';
import { useFinancialYears } from '../hooks/useFinancialYears';
import { jwtDecode } from "jwt-decode";

const ReceiptPage = () => {
  const { receipts, setReceipts } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    cash: 0,
    bank: 0,
    fdr: 0,
    sydr: 0,
    sycr: 0,
    property: 0,
    eme_journal_fund: 0
  });
  const [totalEmeJournalFund, setTotalEmeJournalFund] = useState(0);
  const [bbfValues, setBbfValues] = useState({
    cash: 0,
    bank: 0,
    fdr: 0,
    sydr: 0,
    sycr: 0,
    property: 0,
    eme_journal_fund: 0
  });

  const { financialYears, loading: yearsLoading, error: yearsError } = useFinancialYears();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const months = monthNames.map((month, index) => ({ number: index + 1, name: month }));

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        console.log("User:", decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Add a reference to track mounted state
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchReceiptsAndBBF = useCallback(async () => {
    if (!selectedMonth || !selectedFY) return;
    
    setLoading(true);
    try {
        const monthIndex = monthNames.indexOf(selectedMonth);
        const prevMonth = monthIndex === 0 ? monthNames[11] : monthNames[monthIndex - 1];
        const [year1] = selectedFY.split('-');
        const prevYear = monthIndex === 0 
            ? `${Number(year1) - 1}-${year1}`  // Fixed year format
            : selectedFY;

        console.log('Fetching BBF with:', {
            financialYear: prevYear,
            month: prevMonth,
            type: 'receipt'
        });

        const bbfResponse = await axios.get('http://localhost:5000/api/bbf', {
            params: {
                financialYear: prevYear,
                month: prevMonth,
                type: 'receipt'
            }
        });

        console.log('BBF Response:', bbfResponse.data);

        if (!bbfResponse.data) {
            console.error('No BBF data received');
            throw new Error('No BBF data available');
        }

        const normalizedBBF = {
            cash: Number(bbfResponse.data.cash || 0),
            bank: Number(bbfResponse.data.bank || 0),
            fdr: Number(bbfResponse.data.fdr || 0),
            sydr: Number(bbfResponse.data.sydr || 0),
            sycr: Number(bbfResponse.data.sycr || 0),
            property: Number(bbfResponse.data.property || 0),
            eme_journal_fund: Number(bbfResponse.data.eme_journal_fund || 0)
        };

        console.log('Normalized BBF:', normalizedBBF);
        setBbfValues(normalizedBBF);

        // Rest of the existing fetch logic...
        const [receiptsResponse, paymentsResponse] = await Promise.all([
            axios.get('http://localhost:5000/api/receipts', {
                params: { year: selectedFY, month: selectedMonth }
            }),
            axios.get('http://localhost:5000/api/payments', {
                params: { year: selectedFY, month: selectedMonth }
            })
        ]);

        // Process receipts and update state
        const receipts = receiptsResponse.data;
        setReceipts(receipts);

        // Calculate EME Journal Fund from payments
        const payments = paymentsResponse.data;
        const emeJournalTotal = payments.reduce(
            (sum, payment) => sum + (Number(payment.emeJournalFund) || 0),
            0
        );
        setTotalEmeJournalFund(emeJournalTotal);

        // Calculate totals including BBF
        const newTotals = receipts.reduce((acc, receipt) => ({
            cash: acc.cash + (Number(receipt.cash) || 0),
            bank: acc.bank + (Number(receipt.bank) || 0),
            fdr: acc.fdr + (Number(receipt.fdr) || 0),
            sydr: acc.sydr + (Number(receipt.sydr) || 0),
            sycr: acc.sycr + (Number(receipt.sycr) || 0),
            property: acc.property + (Number(receipt.property) || 0),
            eme_journal_fund: acc.eme_journal_fund + (Number(receipt.eme_journal_fund) || 0),
        }), bbfResponse.data);

        setTotals(newTotals);

    } catch (error) {
        console.error('Fetch error:', error);
        console.error('Error details:', error.response?.data || error.message);
        setError(error.response?.data?.message || 'Failed to fetch data');
    } finally {
        setLoading(false);
    }
}, [selectedFY, selectedMonth]);

  // Memoized handlers to prevent re-renders
  const handleFYChange = useCallback((e) => {
    setSelectedFY(e.target.value);
  }, []);

  const handleMonthChange = useCallback((e) => {
    setSelectedMonth(e.target.value || null);
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedFY) {
      fetchReceiptsAndBBF();
    }
  }, [selectedMonth, selectedFY, fetchReceiptsAndBBF]);

  const year = selectedFY; 
  const month = selectedMonth; 

  let heading;
  if (!year && !month) {
    heading = "Receipt List";
  } else if (year && !month) {
    heading = `Receipt List for ${year}`;
  } else if (year && month) {
    heading = `Receipt List for ${month} ${year}`;
  }

  const handlePrint = () => {
    const printContents = document.getElementById("printable-area").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Receipts</title>
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
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleExcelExport = () => {
    const excelData = receipts.map(receipt => ({
      'Date': new Date(receipt.date).toLocaleDateString("en-GB"),
      'RV': receipt.voucherType + receipt.voucherNo,
      'Particulars': receipt.particulars === "Custom" ? receipt.customParticulars : receipt.particulars,
      'Cash': receipt.cash || '',
      'Bank': receipt.bank || '',
      'FDR': receipt.fdr || '',
      'Sy Dr': receipt.sydr || '',
      'Sy Cr': receipt.sycr || '',
      'Property': receipt.property || '',
      'EME Journal Fund': receipt.eme_journal_fund || ''
    }));

    // Add totals row
    excelData.push({
      'Date': 'Totals',
      'RV': '',
      'Particulars': '',
      'Cash': totals.cash,
      'Bank': totals.bank,
      'FDR': totals.fdr,
      'Sy Dr': totals.sydr,
      'Sy Cr': totals.sycr,
      'Property': totals.property,
      'EME Journal Fund': totals.eme_journal_fund
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Receipts');
    XLSX.writeFile(wb, `Receipts_${selectedFY}_${selectedMonth || 'All'}.xlsx`);
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-gradient-to-r from-teal-100 to-violet-100 font-serif">
        <h1 className="text-3xl mb-4 text-purple-700">Receipt Management</h1>
        <div className="bg-white shadow-md rounded-lg p-6" style={{ fontFamily: 'Times New Roman, serif' }}>
          {/* Filters for year and month */}
          <div className="mb-6 flex space-x-4">
            <select
              className="border px-4 py-2 rounded-lg"
              value={selectedFY}
              onChange={handleFYChange}
              disabled={yearsLoading}
            >
              {yearsLoading ? (
                <option>Loading years...</option>
              ) : yearsError ? (
                <option>Error loading years</option>
              ) : (
                financialYears.map((fy) => (
                  <option key={fy} value={fy}>{fy}</option>
                ))
              )}
            </select>

            <select
              className="border px-4 py-2 rounded-lg"
              value={selectedMonth || ""}
              onChange={handleMonthChange}
            >
              <option value="">Select Month</option>
              {months.map((month) => (
                <option key={month.number} value={month.name}>{month.name}</option>
              ))}
            </select>
          </div>

          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}
          
          {/* Receipt List */}
          <div className="mb-8" id="printable-area">
            <div className="flex justify-center mb-4">
              <h2 className="text-2xl text-black text-center">{heading}</h2>
            </div>
            {receipts.length > 0 ? (
              <div id="receiptList">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-violet-500 text-black">
                      {[
                        "Date", "RV", "Particulars", "Cash", "Bank", "FDR", "Sy Dr", "Sy Cr", "Property", "EME Journal Fund"
                      ].map((header) => (
                        <th key={header} className="px-4 py-2 border border-black">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                  {/* Add BBF row */}
                  <tr className="bg-violet-200 font-bold">
                    <td className="px-4 py-2 border border-black text-center">Date</td>
                    <td className="px-4 py-2 border border-black text-center">RV</td>
                    <td className="px-4 py-2 border border-black text-center">BBF</td>
                    <td className="px-4 py-2 border border-black text-right">{bbfValues.cash.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{bbfValues.bank.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{bbfValues.fdr.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{bbfValues.sydr.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{bbfValues.sycr.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{bbfValues.property.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{bbfValues.eme_journal_fund.toFixed(2)}</td>
                  </tr>
                  {receipts.map((receipt, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-violet-50" : "bg-white"}>
                      <td className="px-4 py-2 border border-black text-center">
                        {new Date(receipt.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-2 border border-black">
                        {receipt.voucherType + receipt.voucherNo}
                      </td>
                      <td className="px-4 py-2 border border-black">
                        {receipt.particulars === "Custom" ? receipt.customParticulars : receipt.particulars}
                      </td>
                      {[
                        "cash", "bank", "fdr", "sydr", "sycr", "property", "eme_journal_fund"
                      ].map((key) => (
                        <td key={key} className="px-4 py-2 border border-black text-right">
                          {receipt[key]||""}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Add totals row */}
                  <tr className="bg-violet-200 font-bold">
                    <td className="px-4 py-2 border border-black" colSpan="3">Totals</td>
                    <td className="px-4 py-2 border border-black text-right">{totals.cash.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{totals.bank.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{totals.fdr.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{totals.sydr.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{totals.sycr.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{totals.property.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{totals.eme_journal_fund.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-violet-200 font-bold">
                    <td className="px-4 py-2 border border-black" colSpan="3">Balance</td>
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                    <td className="px-4 py-2 border border-black text-right">
                      {(totalEmeJournalFund - totals.eme_journal_fund).toFixed(2)}
                    </td>
                  </tr>

                  <tr className="bg-violet-200 font-bold">
                    <td className="px-4 py-2 border border-black" colSpan="3">G / Total</td>
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                    <td className="px-4 py-2 border border-black text-right">
                      {totalEmeJournalFund.toFixed(2)}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            ) : !loading && (
              <p className="text-gray-700">No receipts found for the selected period.</p>
            )}
          </div>
          {receipts.length > 0 && (
            <div className="flex justify-center mt-4 gap-4">
              <button onClick={handlePrint} className="bg-green-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-green hover:scale-110 transition-transform duration-200">
                Print
              </button>
              <button onClick={handleExcelExport} className="bg-blue-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition-transform duration-200">
                Export to Excel
              </button>
            </div>
          )}
          {user && user.toggler !== "Viewer" && <ReceiptForm />}
        </div>
      </div>
    </>
  );
};

export default ReceiptPage;
