import React, { useState, useEffect } from "react";
import axios from 'axios';
import RequestUpdateReceipt from '../components/RequestUpdateReceipt';
import RequestDeleteReceipt from '../components/RequestDeleteReceipt';

const ApprovalsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getApprovals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/approvalsRoute');
        setData(res.data);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      }
    };
    getApprovals();
  }, []);

  const performUpdate = async (type, action, details) => {
    try {
      switch(type.toLowerCase()) {
        case 'receipt':
          if (action === 'update') {
            await axios.put('http://localhost:5000/api/receipts', {
              voucherType: details.voucherType,
              voucherNo: details.voucherNo,
              ...details
            });
          } else if (action === 'delete') {
            // Ensure we have all required parameters and they're not undefined
            const params = {
              voucherType: details.voucherType,
              voucherNo: details.voucherNo,
              year: details.financialYear || new Date().getFullYear().toString(),
              particulars: details.particulars || 'Custom'
            };

            // Log the params for debugging
            console.log('Delete receipt params:', params);

            // Make sure all required params are present
            if (!params.voucherType || !params.voucherNo || !params.year) {
              throw new Error('Missing required parameters for delete operation');
            }

            const queryString = new URLSearchParams({
              voucherType: params.voucherType,
              voucherNo: params.voucherNo,
              year: `FY${params.year}-${Number(params.year) + 1}`,
              particulars: params.particulars
            }).toString();

            console.log('Delete URL:', `http://localhost:5000/api/receipts?${queryString}`);
            
            const response = await axios.delete(`http://localhost:5000/api/receipts?${queryString}`);
            
            if (!response.data) {
              throw new Error('No response data from delete request');
            }
            
            console.log('Delete response:', response.data);
          }
          break;

        case 'payment':
          if (action === 'update') {
            await axios.put('http://localhost:5000/api/payments', {
              voucherType: details.voucherType,
              voucherNo: details.voucherNo,
              ...details
            });
          } else if (action === 'delete') {
            await axios.delete(`http://localhost:5000/api/payments?voucherType=${details.voucherType}&voucherNo=${details.voucherNo}&year=${details.financialYear}`);
          }
          break;

        case 'unit':
          if (action === 'update') {
            await axios.put(`http://localhost:5000/api/units/update/${details.nameOfUnit}`, details);
          } else if (action === 'delete') {
            await axios.delete(`http://localhost:5000/api/units/delete/${details.nameOfUnit}`);
          }
          break;

        case 'fdr':
          if (action === 'update') {
            await axios.put(`http://localhost:5000/api/fdr/${details.fdrNo}`, details);
          } else if (action === 'delete') {
            await axios.delete(`http://localhost:5000/api/fdr/${details.fdrNo}`);
          }
          break;

        default:
          throw new Error('Unknown request type');
      }
    } catch (error) {
      console.error('Error in performUpdate:', error);
      console.log('Error details:', {
        type,
        action,
        details,
        errorMessage: error.message,
        response: error.response?.data,
        fullError: error
      });
      throw error; // Re-throw to be handled by the caller
    }
  };

  const handleApproval = async (approval) => {
    setLoading(true);
    try {
      // First update the approval status
      await axios.put(`http://localhost:5000/api/approvalsRoute/update-status/${approval._id}`, {
        status: 'approved'
      });

      // Refresh the approvals list
      const res = await axios.get('http://localhost:5000/api/approvalsRoute');
      setData(res.data);

      alert('Request approved successfully');
    } catch (error) {
      console.error("Error processing approval:", error);
      alert(`Error processing approval: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (approvalId) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/approvalsRoute/update-status/${approvalId}`, {
        status: 'rejected'
      });
      
      // Refresh the approvals list after rejection
      const res = await axios.get('http://localhost:5000/api/approvalsRoute');
      setData(res.data);
      
      // Show success message
      alert('Request rejected successfully');
    } catch (error) {
      console.error("Error rejecting approval:", error);
      alert("Error rejecting approval: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDetailsTable = (details) => {
    if (!details) return null;

    return (
      <table className="min-w-full border-collapse border border-gray-300 mt-2">
        <tbody>
          {Object.entries(details).map(([key, value], index) => (
            <tr key={key} className={index % 2 === 0 ? "bg-violet-50" : "bg-white"}>
              <th className="px-4 py-2 border border-black text-left bg-violet-500 text-black w-1/3">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
              </th>
              <td className="px-4 py-2 border border-black">
                {typeof value === 'object' ? JSON.stringify(value) : value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Approval Requests</h1>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item._id || index} className="bg-white overflow-hidden shadow rounded-lg w-full">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-xl text-gray-900">Request {index + 1}</div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-semibold">Request From:</p>
                      <p>{item.requestFrom}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Request On:</p>
                      <p>{item.requestOn}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Request Type:</p>
                      <p>{item.requestType}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Request Date:</p>
                      <p>{new Date(item.requestDate).toLocaleDateString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold mb-2">Details:</p>
                      {renderDetailsTable(item.details)}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  {item.requestOn.toLowerCase() === 'receipt' && (
                    item.requestType === 'update' ? (
                      <RequestUpdateReceipt 
                        newReceipt={item.details}
                        approval={item}
                        setApprovalData={setData}
                      />
                    ) : item.requestType === 'delete' ? (
                      <RequestDeleteReceipt 
                        newReceipt={item.details}
                        approval={item}
                        setApprovalData={setData}
                      />
                    ) : (
                      <button 
                        onClick={() => handleApproval(item)}
                        disabled={loading || item.status === 'approved'}
                        className={`px-4 py-2 text-white rounded transition-colors ${
                          loading || item.status === 'approved' 
                            ? 'bg-gray-400' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {item.status === 'approved' ? 'Approved' : 'Approve'}
                      </button>
                    )
                  )}
                  <button 
                    onClick={() => handleReject(item._id)}
                    disabled={loading || item.status === 'rejected'}
                    className={`px-4 py-2 text-white rounded transition-colors ${
                      loading || item.status === 'rejected'
                        ? 'bg-gray-400' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {item.status === 'rejected' ? 'Rejected' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No approval requests found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalsPage;