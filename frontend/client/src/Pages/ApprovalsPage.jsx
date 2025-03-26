import React, { useState, useEffect } from "react";
import axios from 'axios';

const ApprovalsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications');
      setData(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleApproval = async (notification) => {
    setLoading(true);
    try {
      if (notification.notificationType === 'delete') {
        // Format financial year properly
        const date = new Date(notification.details.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const startYear = month <= 3 ? year - 1 : year;
        const financialYear = `FY${startYear}-${startYear + 1}`;

        // Call the existing delete route with all required params
        await axios.delete(`http://localhost:5000/api/receipts`, {
          params: {
            year: financialYear,
            voucherType: notification.details.voucherType,
            voucherNo: Number(notification.details.voucherNo),
            particulars: notification.details.particulars || 'Custom'
          }
        });

        // Update notification status only after successful deletion
        await axios.put(`http://localhost:5000/api/notifications/update-status/${notification._id}`, {
          status: 'approved'
        });

        alert('Receipt deleted successfully');
        await fetchNotifications();
      } else if (notification.notificationType === 'update') {
        // Format financial year properly
        const date = new Date(notification.details.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const startYear = month <= 3 ? year - 1 : year;
        const financialYear = `FY${startYear}-${startYear + 1}`;

        // Format receipt data
        const receiptData = {
          ...notification.details,
          financialYear,
          voucherNo: Number(notification.details.voucherNo),
          date: new Date(notification.details.date).toISOString(),
          cash: Number(notification.details.cash || 0),
          bank: Number(notification.details.bank || 0),
          fdr: Number(notification.details.fdr || 0),
          sydr: Number(notification.details.sydr || 0),
          sycr: Number(notification.details.sycr || 0),
          property: Number(notification.details.property || 0),
          eme_journal_fund: Number(notification.details.eme_journal_fund || 0),
          counterVoucherNo: Number(notification.details.counterVoucherNo || 0)
        };

        console.log('Updating receipt with:', { financialYear, receiptData });

        // Update receipt
        const updateResponse = await axios.put(
          `http://localhost:5000/api/receipts?year=${financialYear}`,
          receiptData
        );

        if (updateResponse.data) {
          // Update notification status after successful receipt update
          await axios.put(`http://localhost:5000/api/notifications/update-status/${notification._id}`, {
            status: 'approved'
          });

          alert('Receipt updated successfully');
          await fetchNotifications();
        }
      }
    } catch (error) {
      console.error("Error in approval:", error.response?.data || error);
      alert("Failed to process approval: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Approval Requests</h1>
        {data.map((item) => (
          <div key={item._id} className="bg-white shadow rounded-lg p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {item.notificationType === 'update' ? 'Receipt Update Request' : item.notificationType}
              </h2>
              <span className={`px-3 py-1 rounded-full ${
                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                item.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {item.status}
              </span>
            </div>
            <pre className="bg-gray-50 p-4 rounded">
              {JSON.stringify(item.details, null, 2)}
            </pre>
            {item.status === 'pending' && (
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => handleApproval(item)}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalsPage;