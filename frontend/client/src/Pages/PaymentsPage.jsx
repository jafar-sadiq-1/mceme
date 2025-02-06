import { useContext, useState, useEffect } from "react";
import Header from "../components/Header";
import { AppContext } from "../AppContext/ContextProvider";
import PaymentForm from "../components/PaymentForm";
import axios from "axios";

const PaymentsPage = () => {
  const { payments, setPayments } = useContext(AppContext);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Generate last 10 years dynamically
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const months = monthNames.map((month, index) => ({ number: index + 1, name: month }));

  useEffect(() => {
    const fetchPayments = async () => {
      // if (!selectedYear || !selectedMonth) return; // Ensure both filters are selected

      try {
        const response = await axios.get("http://localhost:5000/api/payments", {
          params: { year: selectedYear, month: selectedMonth } // Use month name
        });
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, [selectedYear, selectedMonth, setPayments]);

  return (
    <>
      <Header />
      <div className="p-6 bg-gradient-to-r from-teal-100 to-violet-100 font-serif">
        <h1 className="text-3xl mb-4 text-purple-700">Payment Management</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Year & Month Filters */}
          <div className="mb-6 flex space-x-4">
            <select
              className="border px-4 py-2 rounded-lg"
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(e.target.value || null)}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
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

          {/* Payment List */}
          <div className="mb-8">
            <h2 className="text-2xl text-black mb-4">Payment List</h2>
            {payments.length > 0 ? (
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-violet-600 text-white">
                    {[
                      "Date", "PV", "Particulars", "Cash", "Bank", "FDR", "Sy Dr", "Sy Cr", "Property", "EME Journal Fund"
                    ].map((header) => (
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
                      <td className="px-4 py-2 border border-gray-300">{payment.pv + payment.pvNo}</td>
                      {[
                        "particulars", "cash", "bank", "fdr", "syDr", "syCr", "property", "emeJournalFund"
                      ].map((key) => (
                        <td key={key} className="px-4 py-2 border border-gray-300 text-right">{payment[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-700">No payments added yet.</p>
            )}
          </div>
          <PaymentForm />
        </div>
      </div>
    </>
  );
};

export default PaymentsPage;
