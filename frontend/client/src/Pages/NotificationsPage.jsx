import { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from 'axios';

const NotificationsPage = () => {
  const [maturingFDRs, setMaturingFDRs] = useState([]);

  useEffect(() => {
    const fetchFDRs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fdr');
        const fdrs = response.data;
        
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        
        const upcomingMaturities = fdrs.filter(fdr => {
          const maturityDate = new Date(fdr.maturityDate);
          return maturityDate <= oneMonthFromNow && maturityDate >= new Date();
        });

        setMaturingFDRs(upcomingMaturities);
      } catch (error) {
        console.error('Error fetching FDRs:', error);
      }
    };

    fetchFDRs();
  }, []);

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-teal-100 to-violet-100 p-8">
        <div className="bg-white shadow-md rounded-lg p-6 mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h2>
          
          {/* FDR Maturity Notifications */}
          {maturingFDRs.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Upcoming FDR Maturities</h3>
              <div className="space-y-4">
                {maturingFDRs.map((fdr) => (
                  <div key={fdr.fdrNo} className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">FDR No: {fdr.fdrNo}</h4>
                        <p className="text-gray-700">Bank: {fdr.bank}</p>
                        <p className="text-gray-700">Maturity Date: {new Date(fdr.maturityDate).toLocaleDateString("en-GB")}</p>
                        <p className="text-gray-700">Amount: {formatCurrency(fdr.amount)}</p>
                        <p className="text-gray-700">Maturity Value: {formatCurrency(fdr.maturityValue)}</p>
                      </div>
                      <div className="bg-red-100 px-3 py-1 rounded-full">
                        <span className="text-red-700">
                          {Math.ceil((new Date(fdr.maturityDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;