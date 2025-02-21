import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYearsList, getCurrentFinancialYear } from '../utils/financialYearHelper';

const InflowPage = () => {
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inflowData, setInflowData] = useState([]);
  const { units, setUnits } = useContext(AppContext);
  const currentDate = new Date();
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  
  const financialYears = getFinancialYearsList(10);
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [receiptsResponse, unitsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/receipts', {
            params: { 
              year: selectedFY,
              month: selectedMonth 
            }
          }),
          axios.get('http://localhost:5000/api/units')
        ]);

        setUnits(unitsResponse.data);

        const bankReceipts = receiptsResponse.data.filter(
          receipt => receipt.voucherType === "RV" && receipt.method === "bank"
        );

        const processedData = await Promise.all(bankReceipts.map(async (receipt, index) => {
          const baseData = {
            srNo: index + 1,
            date: new Date(receipt.date).toLocaleDateString("en-GB"),
            inflow: receipt.particulars,
            subsPrevYr: 0,
            subsCurYr: 0,
            otherReceipts: 0,
            total: 0
          };

          const unit = units.find(u => u.nameOfUnit === receipt.particulars);

          if (!unit) {
            const amount = Number(receipt[receipt.method] || 0);
            return {
              ...baseData,
              otherReceipts: amount,
              total: amount
            };
          }

          const relevantHistory = unit.history.filter(
            h => h.voucherType === receipt.voucherType && 
                 h.voucherNo === receipt.voucherNo
          );

          relevantHistory.forEach(entry => {
            const amount = Number(entry.amount || 0);
            switch (entry.receiptFor) {
              case 'Last Financial Year Amount':
                baseData.subsPrevYr += amount;
                break;
              case 'Current Financial Year Amount':
                baseData.subsCurYr += amount;
                break;
              case 'Advance Amount':
                baseData.otherReceipts += amount;
                break;
              default:
                baseData.otherReceipts += amount;
                break;
            }
          });

          baseData.total = baseData.subsPrevYr + baseData.subsCurYr + baseData.otherReceipts;
          return baseData;
        }));

        const cleanedData = processedData.filter(Boolean).map(item => ({
          ...item,
          subsPrevYr: Number(item.subsPrevYr || 0),
          subsCurYr: Number(item.subsCurYr || 0),
          otherReceipts: Number(item.otherReceipts || 0),
          total: Number(item.total || 0)
        }));

        setInflowData(cleanedData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [setUnits, selectedFY, selectedMonth]);

  const totals = inflowData.reduce((acc, item) => ({
    subsPrevYr: acc.subsPrevYr + Number(item.subsPrevYr || 0),
    subsCurYr: acc.subsCurYr + Number(item.subsCurYr || 0),
    otherReceipts: acc.otherReceipts + Number(item.otherReceipts || 0),
    total: acc.total + Number(item.total || 0)
  }), { subsPrevYr: 0, subsCurYr: 0, otherReceipts: 0, total: 0 });

  const handleRemarkChange = (index, value) => {
    setRemarks(prev => {
      const newRemarks = [...prev];
      newRemarks[index] = value;
      return newRemarks;
    });
  };

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
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  let heading;
  if (!selectedFY && !selectedMonth) {
    heading = "Inflow Statement";
  } else if (selectedFY && !selectedMonth) {
    heading = `Inflow Statement for ${selectedFY}`;
  } else {
    heading = `Inflow Statement for ${selectedMonth} ${selectedFY}`;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-teal-100 to-violet-100" 
           style={{ fontFamily: 'Times New Roman, serif' }}>
        <div className="py-10 flex justify-center">
          <div className="bg-white shadow-md rounded-lg p-6 w-auto">
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
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                {monthNames.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div id="print">
              <h1 className="text-center text-2xl font-bold mb-6">{heading}</h1>
              
              {loading && <div className="text-center">Loading...</div>}
              {error && <div className="text-center text-red-500">{error}</div>}
              
              {!loading && !error && (
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead className="bg-violet-400 text-black">
                    <tr>
                      <th className="border border-black p-3">S.No</th>
                      <th className="border border-black p-3">Date</th>
                      <th className="border border-black p-3">Inflow</th>
                      <th className="border border-black p-3">Subs for Last FY</th>
                      <th className="border border-black p-3">Subs for Current FY</th>
                      <th className="border border-black p-3">Other Receipts</th>
                      <th className="border border-black p-3">Total</th>
                      <th className="border border-black p-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inflowData.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="border border-black p-3">{item.srNo}</td>
                        <td className="border border-black p-3">{item.date}</td>
                        <td className="border border-black p-3">{item.inflow}</td>
                        <td className="border border-black p-3">₹{(item.subsPrevYr || 0).toFixed(2)}</td>
                        <td className="border border-black p-3">₹{(item.subsCurYr || 0).toFixed(2)}</td>
                        <td className="border border-black p-3">₹{(item.otherReceipts || 0).toFixed(2)}</td>
                        <td className="border border-black p-3">₹{(item.total || 0).toFixed(2)}</td>
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
                      <td className="border border-black p-3" colSpan={3}>Total</td>
                      <td className="border border-black p-3">₹{totals.subsPrevYr.toFixed(2)}</td>
                      <td className="border border-black p-3">₹{totals.subsCurYr.toFixed(2)}</td>
                      <td className="border border-black p-3">₹{totals.otherReceipts.toFixed(2)}</td>
                      <td className="border border-black p-3">₹{totals.total.toFixed(2)}</td>
                      <td className="border border-black p-3">-</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        
        {!loading && !error && inflowData.length > 0 && (
          <div className="flex justify-center mt-4">
            <button onClick={handlePrint} className="bg-green-500 border border-black text-black px-4 py-2 rounded hover:bg-green-600 hover:scale-110 transition-transform duration-200">
              Print
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default InflowPage;