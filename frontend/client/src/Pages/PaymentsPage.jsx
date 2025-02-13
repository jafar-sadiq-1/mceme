import { useContext, useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import { AppContext } from "../AppContext/ContextProvider";
import PaymentForm from "../components/PaymentForm";
import axios from "axios";
import { getFinancialYearsList, getCurrentFinancialYear } from "../utils/financialYearHelper";

const PaymentsPage = () => {
  const { payments, setPayments } = useContext(AppContext);
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    cash: 0, bank: 0, fdr: 0, syDr: 0, syCr: 0, property: 0, emeJournalFund: 0
  });

  const financialYears = getFinancialYearsList(4);
  const abortControllerRef = useRef(null);

  const fetchPayments = async (year, month) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel previous request
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    try {
      
      const response = await axios.get("http://localhost:5000/api/payments", {
        params: { year, month },
        signal: abortControllerRef.current.signal,
      });
      console.log(year,month);
      setPayments(response.data);

      // Calculate totals efficiently
      const newTotals = response.data.reduce(
        (acc, payment) => ({
          cash: acc.cash + (Number(payment.cash) || 0),
          bank: acc.bank + (Number(payment.bank) || 0),
          fdr: acc.fdr + (Number(payment.fdr) || 0),
          syDr: acc.syDr + (Number(payment.syDr) || 0),
          syCr: acc.syCr + (Number(payment.syCr) || 0),
          property: acc.property + (Number(payment.property) || 0),
          emeJournalFund: acc.emeJournalFund + (Number(payment.emeJournalFund) || 0),
        }),
        { cash: 0, bank: 0, fdr: 0, syDr: 0, syCr: 0, property: 0, emeJournalFund: 0 }
      );

      setTotals(newTotals);
    } catch (error) {
      if (!axios.isCancel(error)) {
        setError("Failed to fetch payments. Please try again later.");
        console.error("Error fetching payments:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(selectedFY, selectedMonth);
  }, [selectedFY, selectedMonth]);

  return (
    <>
      <Header />
      <div className="p-6 bg-gradient-to-r from-teal-100 to-violet-100 font-serif">
        <h1 className="text-3xl mb-4 text-purple-700">Payment Management</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
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
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}
          
          {/* Payment List */}
          <div className="mb-8">
            <h2 className="text-2xl text-black text-center">
              {selectedFY ? `Payment List for ${selectedFY}` : "Payment List"}
              {selectedMonth && ` - ${new Date(0, selectedMonth - 1).toLocaleString("en", { month: "long" })}`}
            </h2>

            {payments.length > 0 ? (
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-violet-600 text-white">
                    {["Date", "PV", "Particulars", "Cash", "Bank", "FDR", "Sy Dr", "Sy Cr", "Property", "EME Journal Fund"].map((header) => (
                      <th key={header} className="px-4 py-2 border border-gray-300">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-violet-50" : "bg-white"}>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {new Date(payment.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">{payment.voucherType + payment.voucherNo}</td>
                      <td className="px-4 py-2 border border-gray-300">
                        {payment.particulars === "Custom" ? payment.customParticulars : payment.particulars}
                      </td>
                      {["cash", "bank", "fdr", "syDr", "syCr", "property", "emeJournalFund"].map((key) => (
                        <td key={key} className="px-4 py-2 border border-gray-300 text-right">
                          {payment[key] || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-violet-200 font-bold">
                    <td className="px-4 py-2 border border-gray-300" colSpan="3">Totals</td>
                    {["cash", "bank", "fdr", "syDr", "syCr", "property", "emeJournalFund"].map((key) => (
                      <td key={key} className="px-4 py-2 border border-gray-300 text-right">
                        {totals[key].toFixed(2)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            ) : !loading && <p className="text-gray-700">No payments found for the selected period.</p>}
          </div>
          <PaymentForm />
        </div>
      </div>
    </>
  );
};

export default PaymentsPage;
