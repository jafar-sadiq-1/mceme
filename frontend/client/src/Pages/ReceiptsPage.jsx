import { useContext, useState, useEffect } from "react";
import Header from "../components/Header"; // This line already exists in your code
import { AppContext } from "../AppContext/ContextProvider";
import ReceiptForm from "../components/ReceiptForm";
import axios from 'axios';
import { getFinancialYearsList, getCurrentFinancialYear } from '../utils/financialYearHelper';

const ReceiptPage = () => {
  const { receipts, setReceipts } = useContext(AppContext);
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

  const financialYears = getFinancialYearsList(10); // Get last 10 financial years

  useEffect(() => {
    const fetchReceipts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/receipts`,
          {
            params: {
              year: selectedFY,
              month: selectedMonth
            }
          }
        );
        setReceipts(response.data);
        
        // Calculate totals
        const newTotals = response.data.reduce((acc, receipt) => ({
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
        
        setTotals(newTotals);
      } catch (error) {
        setError("Failed to fetch receipts. Please try again later.");
        console.error("Error fetching receipts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [selectedFY, selectedMonth, setReceipts]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const months = monthNames.map((month, index) => ({ number: index + 1, name: month }));

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

  return (
    <>
      <Header />
      <div className="p-6 bg-gradient-to-r from-teal-100 to-violet-100 font-serif">
        <h1 className="text-3xl mb-4 text-purple-700">Receipt Management</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Filters for year and month */}
          <div className="mb-6 flex space-x-4">
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

          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}
          
          {/* Receipt List */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <h2 className="text-2xl text-black text-center">{heading}</h2>
            </div>
            {receipts.length > 0 ? (
              <div id="receiptList">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-violet-600 text-white">
                      {[
                        "Date", "RV", "Particulars", "Cash", "Bank", "FDR", "Sy Dr", "Sy Cr", "Property", "EME Journal Fund"
                      ].map((header) => (
                        <th key={header} className="px-4 py-2 border border-gray-300">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                  {receipts.map((receipt, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-violet-50" : "bg-white"}>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {new Date(receipt.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {receipt.voucherType + receipt.voucherNo}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {receipt.particulars === "Custom" ? receipt.customParticulars : receipt.particulars}
                      </td>
                      {[
                        "cash", "bank", "fdr", "syDr", "syCr", "property", "emeJournalFund"
                      ].map((key) => (
                        <td key={key} className="px-4 py-2 border border-gray-300 text-right">
                          {receipt[key]||""}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Add totals row */}
                  <tr className="bg-violet-200 font-bold">
                    <td className="px-4 py-2 border border-gray-300" colSpan="3">Totals</td>
                    <td className="px-4 py-2 border border-gray-300 text-right">{totals.cash.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-gray-300 text-right">{totals.bank.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-gray-300 text-right">{totals.fdr.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-gray-300 text-right">{totals.sydr.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-gray-300 text-right">{totals.sycr.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-gray-300 text-right">{totals.property.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-gray-300 text-right">{totals.eme_journal_fund.toFixed(2)}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            ) : !loading && (
              <p className="text-gray-700">No receipts found for the selected period.</p>
            )}
          </div>
          <ReceiptForm />
        </div>
      </div>
    </>
  );
};

export default ReceiptPage;
