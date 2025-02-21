import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import * as XLSX from 'xlsx';

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const SyDrPage = () => {
  const { units, setUnits } = useContext(AppContext);
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/units');
        // Filter units with lastFinancialYearAmount > 0
        const filteredUnits = response.data.filter(unit => unit.lastFinancialYearAmount > 0);
        setUnits(filteredUnits);
      } catch (error) {
        setError('Error fetching units');
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [setUnits]);

  // Transform units data for table display
  const tableData = units
    .map((unit, index) => ({
      srNo: index + 1,
      unitName: unit.nameOfUnit,
      amt: unit.lastFinancialYearAmount
    }));

  // Calculate total amount
  const totalAmount = tableData.reduce((sum, item) => sum + item.amt, 0);

  const handleRemarkChange = (index, value) => {
    setRemarks(prev => {
      const newRemarks = [...prev];
      newRemarks[index] = value;
      return newRemarks;
    });
  };

  const currentDate = formatDate(new Date());

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

  const handleExportToExcel = () => {
    // First row will be the title
    const excelData = [
      [`List of Last Financial Year Dues on ${currentDate}`],
      [], // Empty row for spacing
      // Add headers
      ['Sr No', 'Name of the Unit', 'Last FY Amount', 'Remarks']
    ];

    // Add data rows
    tableData.forEach((item) => {
      excelData.push([
        item.srNo,
        item.unitName,
        item.amt,
        remarks[item.srNo - 1] || ''
      ]);
    });

    // Add total row
    excelData.push([
      '',
      'Total',
      totalAmount,
      ''
    ]);

    // Create worksheet from the array of arrays
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Style the title
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } } // Merge first row across all columns
    ];

    // Auto-size columns
    const colWidths = [
      { wch: 8 },  // Sr No
      { wch: 30 }, // Name of the Unit
      { wch: 15 }, // Last FY Amount
      { wch: 20 }, // Remarks
    ];
    ws['!cols'] = colWidths;

    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Last FY Dues');

    // Generate Excel file
    XLSX.writeFile(wb, `Last_FY_Dues_${currentDate.replace(/\s/g, '_')}.xlsx`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-teal-100 to-violet-100" 
           style={{ fontFamily: 'Times New Roman, serif' }}>
        <div className="py-10 flex justify-center">
          <div className="bg-white shadow-md rounded-lg p-6 w-auto">
            <div id="print">
              <h1 className="text-center text-2xl font-bold mb-6">
                List of Last Financial Year Dues on {currentDate}
              </h1>
              
              {loading && <div className="text-center">Loading...</div>}
              {error && <div className="text-center text-red-500">{error}</div>}
              
              {!loading && !error && (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead className="bg-violet-400 text-black">
                      <tr>
                        <th className="border border-black p-3">Sr No</th>
                        <th className="border border-black p-3">Name of the Unit</th>
                        <th className="border border-black p-3">Last FY Amount</th>
                        <th className="border border-black p-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((item, index) => (
                        <tr key={index} className="text-center">
                          <td className="border border-black p-3">{item.srNo}</td>
                          <td className="border border-black p-3">{item.unitName}</td>
                          <td className="border border-black p-3">₹{item.amt.toFixed(2)}</td>
                          <td className="border border-black p-3">
                            <input
                              type="text"
                              value={remarks[index] || ''}
                              onChange={(e) => handleRemarkChange(index, e.target.value)}
                              placeholder="Enter remarks"
                              className="border border-black px-1 py-1 w-full"
                            />
                          </td>
                        </tr>
                      ))}
                      <tr className="text-center font-bold bg-gray-200">
                        <td className="border border-black p-3" colSpan={2}>Total</td>
                        <td className="border border-black p-3">₹{totalAmount.toFixed(2)}</td>
                        <td className="border border-black p-3">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {!loading && !error && tableData.length > 0 && (
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handlePrint} 
              className="bg-green-500 border border-black text-black px-4 py-2 rounded hover:bg-green-600 hover:scale-110 transition-transform duration-200"
            >
              Print
            </button>
            <button 
              onClick={handleExportToExcel}
              className="bg-blue-500 border border-black text-black px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 transition-transform duration-200"
            >
              Export to Excel
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SyDrPage;