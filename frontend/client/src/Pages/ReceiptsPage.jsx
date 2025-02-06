import { useContext, useState, useEffect } from "react";
import Header from "../components/Header";
import { AppContext } from "../AppContext/ContextProvider";
import ReceiptForm from "../components/ReceiptForm";
import axios from 'axios';

const ReceiptPage = () => {
  const { receipts, setReceipts } = useContext(AppContext);

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // Fetch filtered receipts from backend

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/receipts", {
          params: {
            year: selectedYear,
            month: selectedMonth
          }
        });
        setReceipts(response.data);
      } catch (error) {
        console.error("Error fetching receipts:", error);
      }
    };

    fetchReceipts();
  }, [selectedYear, selectedMonth]);

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const months = monthNames.map((month, index) => ({ number: index + 1, name: month }));


  return (
    <>
      <Header />
      <div className="p-6 bg-gradient-to-r from-teal-100 to-violet-100 font-serif">
        <h1 className="text-3xl mb-4" style={{ color: '#6A1D8F' }}>Receipt Management</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Filters for year and month */}
          <div className="mb-6 flex space-x-4">
            <select
              className="border px-4 py-2 rounded-lg"
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(e.target.value || null)}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              className="border px-4 py-2 rounded-lg"
              value={selectedMonth || ""}
              onChange={(e) => setSelectedMonth(e.target.value || null)}
            >
              <option value="">Select Month</option>
              {months.map((month) => (
                <option key={month.number} value={month.name}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>

          {/* Receipt List */}
          <div className="mb-8">
            <h2 className="text-2xl text-black mb-4">Receipt List</h2>
            {receipts.length > 0 ? (
              <table className="table-auto w-full border-collapse border border-gray-300" style={{ fontFamily: 'Times New Roman, serif' }}>
                <thead>
                  <tr className="bg-violet-600 text-white">
                    <th className="px-4 py-2 border border-gray-300">Date</th>
                    <th className="px-4 py-2 border border-gray-300">RV</th>
                    <th className="px-4 py-2 border border-gray-300">PARTICULARS</th>
                    <th className="px-4 py-2 border border-gray-300">CASH</th>
                    <th className="px-4 py-2 border border-gray-300">BANK</th>
                    <th className="px-4 py-2 border border-gray-300">FDR</th>
                    <th className="px-4 py-2 border border-gray-300">Sy Dr</th>
                    <th className="px-4 py-2 border border-gray-300">Sy Cr</th>
                    <th className="px-4 py-2 border border-gray-300">PROPERTY</th>
                    <th className="px-4 py-2 border border-gray-300">EME JOURNAL FUND</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((receipt, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-violet-50' : 'bg-white'}>
                      <td className="px-4 py-2 border border-gray-300 text-center">{new Date(receipt.date).toLocaleDateString("en-GB")}</td>
                      <td className="px-4 py-2 border border-gray-300">{receipt.rv + receipt.rvNo.toString()}</td>
                      <td className="px-4 py-2 border border-gray-300">{receipt.particulars}</td>
                      <td className="px-4 py-2 border border-gray-300 text-right">{receipt.cash}</td>
                      <td className="px-4 py-2 border border-gray-300 text-right">{receipt.bank}</td>
                      <td className="px-4 py-2 border border-gray-300 text-right">{receipt.fdr}</td>
                      <td className="px-4 py-2 border border-gray-300 text-right">{receipt.syDr}</td>
                      <td className="px-4 py-2 border border-gray-300 text-right">{receipt.syCr}</td>
                      <td className="px-4 py-2 border border-gray-300 text-right">{receipt.property}</td>
                      <td className="px-4 py-2 border border-gray-300 text-right">{receipt.emeJournalFund}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="font-serif text-gray-600">No receipts added yet.</p>
            )}
          </div>
          <ReceiptForm />
        </div>
      </div>
    </>
  );
};

export default ReceiptPage;
