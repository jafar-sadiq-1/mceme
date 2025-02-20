import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYearsList, getCurrentFinancialYear } from '../utils/financialYearHelper';

const AllPaymentsPage = () => {
  const { setAllPayments } = useContext(AppContext);
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payments, setPayments] = useState([]);

  const financialYears = getFinancialYearsList(10);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/payments", {
          params: { 
            year: selectedFY,
            voucherType: "PV" // Only fetch PV type vouchers
          }
        });

        // Transform the data
        const transformedPayments = response.data
          .filter(payment => payment.voucherType === "PV")
          .map((payment, index) => ({
            SNo: index + 1,
            Date: new Date(payment.date).toLocaleDateString("en-GB"),
            Month: new Date(payment.date).toLocaleString('default', { month: 'short' }) + 
                  '-' + new Date(payment.date).getFullYear(),
            PVNo: `${payment.voucherType}${payment.voucherNo}`,
            Particulars: payment.particulars === "Custom" ? 
                        payment.customParticulars : 
                        payment.particulars,
            TypeOfPayment: payment.paymentType,
            Amount: `₹${payment[payment.method]?.toLocaleString() || 0}`
          }));

        setPayments(transformedPayments);
        setAllPayments(response.data);
      } catch (error) {
        setError("Failed to fetch payments");
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [selectedFY, setAllPayments]);

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

  return (
    <>
      <Header />
      <div className="p-6 bg-gradient-to-r from-teal-100 to-violet-100 min-h-screen" 
           style={{ fontFamily: 'Times New Roman, serif' }}>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          {/* Year Filter */}
          <div className="mb-6 flex justify-between items-center">
            <select
              className="border px-4 py-2 rounded-lg"
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
            >
              {financialYears.map((fy) => (
                <option key={fy} value={fy}>{fy}</option>
              ))}
            </select>
          </div>

          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}

          <div id="print">
            <h2 className="text-3xl mb-4 text-center" style={{ color: '#6A1D8F' }}>
              All Payments for {selectedFY}
            </h2>
            
            {payments.length > 0 ? (
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-violet-400 text-black">
                    <th className="border p-2">SNo</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Month</th>
                    <th className="border p-2">PV No</th>
                    <th className="border p-2">Particulars</th>
                    <th className="border p-2">Type of Payment</th>
                    <th className="border p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-violet-50' : 'bg-white'}>
                      <td className="border p-2 text-center">{payment.SNo}</td>
                      <td className="border p-2 text-center">{payment.Date}</td>
                      <td className="border p-2 text-center">{payment.Month}</td>
                      <td className="border p-2 text-center">{payment.PVNo}</td>
                      <td className="border p-2 text-center">{payment.Particulars}</td>
                      <td className="border p-2 text-center">{payment.TypeOfPayment}</td>
                      <td className="border p-2 text-center">{payment.Amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : !loading && (
              <p className="text-center text-gray-700">No payments found for the selected year.</p>
            )}
          </div>
        </div>

        {payments.length > 0 && (
          <div className="flex justify-center mt-6">
            <button onClick={handlePrint} className="bg-green-500 border border-black text-black px-4 py-2 rounded hover:bg-green-600 hover:scale-110 transition-transform duration-200">
              Print
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AllPaymentsPage;