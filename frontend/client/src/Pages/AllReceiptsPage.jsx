import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getCurrentFinancialYear } from '../utils/financialYearHelper';
import * as XLSX from 'xlsx';
import { useFinancialYears } from '../hooks/useFinancialYears';

const AllReceiptsPage = () => {
  const { setReceipts } = useContext(AppContext);
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receipts, setReceiptsList] = useState([]);
  const { financialYears, loading: yearsLoading, error: yearsError } = useFinancialYears();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const months = monthNames.map((month, index) => ({ number: index + 1, name: month }));

  useEffect(() => {
    const fetchReceipts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/receipts", {
          params: { 
            year: selectedFY,
            month: selectedMonth,
            voucherType: "RV"
          }
        });

        // Transform the data
        const transformedReceipts = response.data
          .filter(receipt => receipt.voucherType === "RV")
          .map((receipt, index) => ({
            SNo: index + 1,
            Date: new Date(receipt.date).toLocaleDateString("en-GB"),
            Month: new Date(receipt.date).toLocaleString('default', { month: 'short' }) + 
                  '-' + new Date(receipt.date).getFullYear(),
            RVNo: `${receipt.voucherType}${receipt.voucherNo}`,
            Particulars: receipt.particulars === "Custom" ? 
                        receipt.customParticulars : 
                        receipt.particulars,
            TypeOfReceipt: receipt.receiptType,
            Amount: `₹${receipt[receipt.method]?.toLocaleString() || 0}`
          }));

        setReceiptsList(transformedReceipts);
        setReceipts(response.data);
      } catch (error) {
        setError("Failed to fetch receipts");
        console.error("Error fetching receipts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [selectedFY, selectedMonth, setReceipts]);

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
    // Prepare the data for Excel
    const excelData = receipts.map(receipt => ({
      'S.No': receipt.SNo,
      'Date': receipt.Date,
      'Month': receipt.Month,
      'RV No': receipt.RVNo,
      'Particulars': receipt.Particulars,
      'Type of Receipt': receipt.TypeOfReceipt,
      'Amount': receipt.Amount.replace('₹', '').trim() // Remove the ₹ symbol
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 5 },  // S.No
      { wch: 12 }, // Date
      { wch: 12 }, // Month
      { wch: 10 }, // RV No
      { wch: 30 }, // Particulars
      { wch: 15 }, // Type of Receipt
      { wch: 15 }  // Amount
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, `Receipts ${selectedFY}`);

    // Generate and download Excel file
    XLSX.writeFile(workbook, `Receipts_${selectedFY}.xlsx`);
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-gradient-to-r from-teal-100 to-violet-100 min-h-screen" 
           style={{ fontFamily: 'Times New Roman, serif' }}>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          {/* Year and Month Filters */}
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
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month.number} value={month.name}>{month.name}</option>
              ))}
            </select>
          </div>

          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}

          <div id="print">
            <h2 className="text-3xl mb-4 text-center" style={{ color: '#6A1D8F' }}>
              All Receipts for {selectedFY}
            </h2>
            
            {receipts.length > 0 ? (
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-violet-400 text-black">
                    <th className="border p-2">SNo</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Month</th>
                    <th className="border p-2">RV No</th>
                    <th className="border p-2">Particulars</th>
                    <th className="border p-2">Type of Receipt</th>
                    <th className="border p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((receipt, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-violet-50' : 'bg-white'}>
                      <td className="border p-2 text-center">{receipt.SNo}</td>
                      <td className="border p-2 text-center">{receipt.Date}</td>
                      <td className="border p-2 text-center">{receipt.Month}</td>
                      <td className="border p-2 text-center">{receipt.RVNo}</td>
                      <td className="border p-2 text-center">{receipt.Particulars}</td>
                      <td className="border p-2 text-center">{receipt.TypeOfReceipt}</td>
                      <td className="border p-2 text-center">{receipt.Amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : !loading && (
              <p className="text-center text-gray-700">No receipts found for the selected year.</p>
            )}
          </div>
        </div>

        {receipts.length > 0 && (
          <div className="flex justify-center mt-6 gap-4">
            <button onClick={handlePrint} className="bg-green-500 border border-black text-black px-4 py-2 rounded hover:bg-green-600 hover:scale-110 transition-transform duration-200">
              Print
            </button>
            <button onClick={handleExcelExport} className="bg-blue-500 border border-black text-black px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 transition-transform duration-200">
              Export to Excel
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AllReceiptsPage;