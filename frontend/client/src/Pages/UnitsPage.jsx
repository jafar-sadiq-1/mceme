import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import {AppContext}  from '../AppContext/ContextProvider';
import UnitForm from '../components/UnitsForm';
import Header from '../components/Header';
import * as XLSX from 'xlsx';

const UnitsPage = () => {
  const { units, setUnits } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const printRef=useRef();
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/units');
        setUnits(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching units:', error.message || error);
      }
    };
    fetchUnits();
  }, [setUnits]);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const filteredUnits = Array.isArray(units)
    ? units.filter((unit) =>
        unit.nameOfUnit && unit.nameOfUnit.toLowerCase().includes(search.toLowerCase())
      )
    : [];

    const handlePrint = () => {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
  
      document.body.innerHTML = `<div style="position:relative;">
        <style>
          @media print {
            body {
              font-family: 'Times New Roman', serif;
            }
            .watermark {
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
        </style>
        <div class="watermark">EME Journal</div>
        ${printContent}
      </div>`;
  
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore original content
    };

    const handleExcelExport = () => {
      const excelData = filteredUnits.map((unit, index) => ({
        'S.No': index + 1,
        'Ledger Pg No': unit.ledgerPageNumber,
        'Name of Unit': unit.nameOfUnit,
        'Command': unit.command,
        'Subscription Amount': unit.amount || 0,
        'Current FY': unit.currentFinancialYear,
        'Current FY Amount': unit.currentFinancialAmount,
        'Last FY Amount': unit.lastFinancialYearAmount,
        'Unpaid Amount': unit.unpaidAmount,
        'Advance Amount': unit.advanceAmount || 0
      }));
  
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Units');
      XLSX.writeFile(wb, `Units_List_${new Date().toLocaleDateString()}.xlsx`);
    };

  return (
    <>
      <Header />
      <div className="w-full h-full p-6 bg-gradient-to-r from-teal-100 to-violet-100 font-serif">
        <h1 className="text-3xl mb-4 text-purple-700">Units Page</h1>
        <div className="bg-white shadow-md rounded-lg p-6" style={{ fontFamily: 'Times New Roman, serif' }}>
          <UnitForm/>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              className="p-2 border rounded w-1/3"
              placeholder="Search by Unit Name"
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          <div ref={printRef}>
            <h3 className="text-xl font-semibold text-black text-center mb-2">Units List</h3>
            <div className="mt-8">
              <table className="table-auto w-full border-collapse border border-black">
                <thead>
                  <tr className="bg-violet-500 text-black">
                    <th className="px-4 py-2 border border-black">S.No</th>
                    <th className="px-4 py-2 border border-black">Ledger Pg No</th>
                    <th className="px-4 py-2 border border-black">Name of Unit</th>
                    <th className="px-4 py-2 border border-black">Command</th>
                    <th className="px-4 py-2 border border-black">Subscription Amount</th>
                    <th className="px-4 py-2 border border-black">Current FY</th>
                    <th className="px-4 py-2 border border-black">Current FY Amount</th>
                    <th className="px-4 py-2 border border-black">Last FY Amount</th>
                    <th className="px-4 py-2 border border-black">Unpaid Amount</th>
                    <th className="px-4 py-2 border border-black">Advance Amount</th>
                  </tr>
                </thead>
                <tbody>{filteredUnits.map((unit, index) => (
                    <tr key={index} className={index % 2==0 ? "bg-violet-50" : "bg-white"}>
                      <td className="px-4 py-2 border border-black">{index + 1}</td>
                      <td className="px-4 py-2 border border-black">{unit.ledgerPageNumber}</td>
                      <td className="px-4 py-2 border border-black">{unit.nameOfUnit}</td>
                      <td className="px-4 py-2 border border-black">{unit.command}</td>
                      <td className="px-4 py-2 border border-black text-right">₹{unit.amount?.toLocaleString() || '0'}</td>
                      <td className="px-4 py-2 border border-black">{unit.currentFinancialYear}</td>
                      <td className="px-4 py-2 border border-black text-right">₹{unit.currentFinancialAmount.toLocaleString()}</td>
                      <td className="px-4 py-2 border border-black text-right">₹{unit.lastFinancialYearAmount.toLocaleString()}</td>
                      <td className="px-4 py-2 border border-black text-right">₹{unit.unpaidAmount.toLocaleString()}</td>
                      <td className="px-4 py-2 border border-black text-right">₹{unit.advanceAmount?.toLocaleString() || '0'}</td>
                    </tr>))}</tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center gap-4">
            <button 
              onClick={handlePrint} 
              className="bg-green-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-110 transition-transform duration-200"
            >
              Print
            </button>
            <button 
              onClick={handleExcelExport} 
              className="bg-blue-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition-transform duration-200"
            >
              Export to Excel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnitsPage;
