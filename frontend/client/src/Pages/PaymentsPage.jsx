import { useContext, useState, useEffect, useRef, useCallback } from "react";
import Header from "../components/Header";
import { AppContext } from "../AppContext/ContextProvider";
import PaymentForm from "../components/PaymentForm";
import axios from "axios";
import { getCurrentFinancialYear } from "../utils/financialYearHelper";
import * as XLSX from 'xlsx';
import { useFinancialYears } from '../hooks/useFinancialYears';
import { jwtDecode } from 'jwt-decode';

const PaymentsPage = () => {
  const { payments, setPayments } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    cash: 0,
    bank: 0,
    fdr: 0,
    syDr: 0,  // Changed from sydr
    syCr: 0,  // Changed from sycr
    property: 0,
    emeJournalFund: 0  // Changed from eme_journal_fund
  });

  // Add new state for receipt totals
  const [displayReceipts, setDisplayReceipts] = useState({
    cash: 0,
    bank: 0,
    fdr: 0,
    syDr: 0,
    syCr: 0,
    property: 0
  });

  // Add BBF state after other state declarations
  const [bbfValues, setBbfValues] = useState({
    cash: 0,
    bank: 0,
    fdr: 0,
    sydr: 0,
    sycr: 0,
    property: 0,
    emeJournalFund: 0
  });

  const { financialYears, loading: yearsLoading, error: yearsError } = useFinancialYears();
  const abortControllerRef = useRef(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const months = monthNames.map((month, index) => ({ number: index + 1, name: month }));

  const fetchPaymentsData = useCallback(async () => {
    if (!selectedMonth || !selectedFY) return;
    
    setLoading(true);
    try {
      const monthIndex = monthNames.indexOf(selectedMonth);
      const prevMonth = monthIndex === 0 ? monthNames[11] : monthNames[monthIndex - 1];
      const prevYear = monthIndex === 0 
        ? `${selectedFY.split('-')[0]}-${Number(selectedFY.split('-')[1]) - 1}`
        : selectedFY;

      console.log('Fetching BBF for:', { prevYear, prevMonth });

      const bbfResponse = await axios.get('http://localhost:5000/api/bbf', {
        params: {
          financialYear: prevYear,
          month: prevMonth,
          type: 'payment'
        }
      });

      console.log('BBF Response:', bbfResponse.data);

      const normalizedBBF = {
        cash: Number(bbfResponse.data.cash) || 0,
        bank: Number(bbfResponse.data.bank) || 0,
        fdr: Number(bbfResponse.data.fdr) || 0,
        syDr: Number(bbfResponse.data.sydr) || 0,
        syCr: Number(bbfResponse.data.sycr) || 0,
        property: Number(bbfResponse.data.property) || 0,
        emeJournalFund: Number(bbfResponse.data.eme_journal_fund) || 0
      };

      setBbfValues(normalizedBBF);

      // Fetch BBF, payments, and receipts in parallel
      const [paymentsData, receiptsData] = await Promise.all([
        axios.get('http://localhost:5000/api/payments', {
          params: { 
            year: selectedFY, 
            month: selectedMonth 
          }
        }),
        axios.get('http://localhost:5000/api/receipts', {
          params: { 
            year: selectedFY, 
            month: selectedMonth 
          }
        })
      ]);
  
      setPayments(paymentsData.data);
  
      // Calculate totals including BBF
      const paymentTotals = paymentsData.data.reduce((acc, payment) => ({
        cash: acc.cash + (Number(payment.cash) || 0),
        bank: acc.bank + (Number(payment.bank) || 0),
        fdr: acc.fdr + (Number(payment.fdr) || 0),
        syDr: acc.syDr + (Number(payment.syDr) || 0),
        syCr: acc.syCr + (Number(payment.syCr) || 0),
        property: acc.property + (Number(payment.property) || 0),
        emeJournalFund: acc.emeJournalFund + (Number(payment.emeJournalFund) || 0),
      }), normalizedBBF);
  
      setTotals(paymentTotals);
  
      // Calculate receipt totals
      const receiptTotals = receiptsData.data.reduce((acc, receipt) => ({
        cash: acc.cash + (Number(receipt.cash) || 0),
        bank: acc.bank + (Number(receipt.bank) || 0),
        fdr: acc.fdr + (Number(receipt.fdr) || 0),
        syDr: acc.syDr + (Number(receipt.sydr) || 0),
        syCr: acc.syCr + (Number(receipt.sycr) || 0),
        property: acc.property + (Number(receipt.property) || 0),
      }), normalizedBBF);
  
      setDisplayReceipts(receiptTotals);
  
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [selectedFY, selectedMonth]);
  
  useEffect(() => {
    fetchPaymentsData();
  }, [fetchPaymentsData]);

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
    const excelData = payments.map(payment => ({
      'Date': new Date(payment.date).toLocaleDateString("en-GB"),
      'PV': payment.voucherType + payment.voucherNo,
      'Particulars': payment.particulars === "Custom" ? payment.customParticulars : payment.particulars,
      'Cash': payment.cash || '',
      'Bank': payment.bank || '',
      'FDR': payment.fdr || '',
      'Sy Dr': payment.syDr || '',
      'Sy Cr': payment.syCr || '',
      'Property': payment.property || '',
      'EME Journal Fund': payment.emeJournalFund || ''
    }));

    // Add totals row
    excelData.push({
      'Date': 'Totals',
      'PV': '',
      'Particulars': '',
      'Cash': totals.cash,
      'Bank': totals.bank,
      'FDR': totals.fdr,
      'Sy Dr': totals.syDr,
      'Sy Cr': totals.syCr,
      'Property': totals.property,
      'EME Journal Fund': totals.emeJournalFund
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    XLSX.writeFile(wb, `Payments_${selectedFY}_${selectedMonth || 'All'}.xlsx`);
  };

  const year = selectedFY;
  const month = selectedMonth;

  let heading;
  if (!year && !month) {
    heading = "Payment List";
  } else if (year && !month) {
    heading = `Payment List for ${year}`;
  } else if (year && month) {
    heading = `Payment List for ${month} ${year}`;
  }

  // Add memoized month change handler
  const handleMonthChange = useCallback((event) => {
    const value = event.target.value || null;
    setSelectedMonth(value);
  }, []);

  return (
    <>
      <Header />
      <div className="p-6 bg-gradient-to-r from-teal-100 to-violet-100 font-serif">
        <h1 className="text-3xl mb-4 text-purple-700">Payment Management</h1>
        <div className="bg-white shadow-md rounded-lg p-6"style={{ fontFamily: 'Times New Roman, serif' }} >
          <div className="mb-6 flex space-x-4">
            <select
              className="border px-4 py-2 rounded-lg"
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
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
          
          {/* Payment List */}
          <div className="mb-8" id="printable-area">
            <div className="flex justify-center mb-4">
              <h2 className="text-2xl text-black text-center">{heading}</h2>
            </div>

            {payments.length > 0 ? (
              <table className="table-auto w-full border-collapse border border-black">
                <thead>
                  <tr className="bg-violet-500 text-black">
                    {["Date", "PV", "Particulars", "Cash", "Bank", "FDR", "Sy Dr", "Sy Cr", "Property", "EME Journal Fund"].map((header) => (
                      <th key={header} className="px-4 py-2 border border-black">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-violet-200 font-bold">
                    <td className="px-4 py-2 border border-black text-center">Date</td>
                    <td className="px-4 py-2 border border-black text-center">PV</td>
                    <td className="px-4 py-2 border border-black text-center">BBF</td>
                    <td className="px-4 py-2 border border-black text-right">{(bbfValues?.cash || 0).toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{(bbfValues?.bank || 0).toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{(bbfValues?.fdr || 0).toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{(bbfValues?.syDr || 0).toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{(bbfValues?.syCr || 0).toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{(bbfValues?.property || 0).toFixed(2)}</td>
                    <td className="px-4 py-2 border border-black text-right">{(bbfValues?.emeJournalFund || 0).toFixed(2)}</td>
                  </tr>
                  {payments.map((payment, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-violet-50" : "bg-white"}>
                      <td className="px-4 py-2 border border-black text-center">
                        {new Date(payment.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-2 border border-black">{payment.voucherType + payment.voucherNo}</td>
                      <td className="px-4 py-2 border border-black">
                        {payment.particulars === "Custom" ? payment.customParticulars : payment.particulars}
                      </td>
                      {["cash", "bank", "fdr", "syDr", "syCr", "property", "emeJournalFund"].map((key) => (
                        <td key={key} className="px-4 py-2 border border-black text-right">
                          {payment[key] || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-violet-200 font-bold">
                    <td className="px-4 py-2 border border-black" colSpan="3">Totals</td>
                    {["cash", "bank", "fdr", "syDr", "syCr", "property", "emeJournalFund"].map((key) => (
                      <td key={key} className="px-4 py-2 border border-black text-right">
                        {totals[key].toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  {/* Add Balance row */}
                  <tr className="bg-violet-200 font-bold">
                    <td className="px-4 py-2 border border-black" colSpan="3">Balance</td>
                    {["cash", "bank", "fdr", "syDr", "syCr", "property"].map(key => (
                      <td key={key} className="px-4 py-2 border border-black text-right">
                        {(displayReceipts[key] - totals[key]).toFixed(2)}
                      </td>
                    ))}
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                  </tr>

                  {/* Add G/Total row */}
                  <tr className="bg-violet-200 font-bold">
                    <td className="px-4 py-2 border border-black" colSpan="3">G/Total</td>
                    {["cash", "bank", "fdr", "syDr", "syCr", "property"].map(key => (
                      <td key={key} className="px-4 py-2 border border-black text-right">
                        {displayReceipts[key].toFixed(2)}
                      </td>
                    ))}
                    <td className="px-4 py-2 border border-black text-right">0.00</td>
                  </tr>
                </tbody>
              </table>
            ) : !loading && <p className="text-gray-700">No payments found for the selected period.</p>}
          </div>
          {payments.length > 0 && (
            <div className="flex justify-center mt-4 gap-4">
              <button onClick={handlePrint} className="bg-green-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-green hover:scale-110 transition-transform duration-200">
                Print
              </button>
              <button onClick={handleExcelExport} className="bg-blue-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition-transform duration-200">
                Export to Excel
              </button>
            </div>
          )}
          {user && user.toggler !== "Viewer" && <PaymentForm />}
        </div>
      </div>
    </>
  );
};

export default PaymentsPage;
