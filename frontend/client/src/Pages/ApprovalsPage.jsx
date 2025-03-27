import React, { useState, useEffect } from "react";
import axios from 'axios';
import Header from '../components/Header';
import RequestUpdateReceipt from '../components/RequestUpdateReceipt';
import RequestDeleteReceipt from '../components/RequestDeleteReceipt';
import RequestUpdatePayment from '../components/RequestUpdatePayment';
import RequestDeletePayment from '../components/RequestDeletePayment';
import RequestUpdateFDR from '../components/RequestUpdateFDR';
import RequestDeleteFDR from '../components/RequestDeleteFDR';
import RequestUpdateUnit from '../components/RequestUpdateUnit';
import RequestDeleteUnit from '../components/RequestDeleteUnit';

const ApprovalsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    user: 'all',
    requestType: 'all',
    requestOn: 'all'
  });

  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const getApprovals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/approvalsRoute');
        setOriginalData(res.data);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      }
    };
    getApprovals();
  }, []);

  useEffect(() => {
    let filteredData = [...originalData];

    if (filters.status !== 'all') {
      filteredData = filteredData.filter(item => item.status === filters.status);
    }
    if (filters.user !== 'all') {
      filteredData = filteredData.filter(item => item.requestFrom === filters.user);
    }
    if (filters.requestType !== 'all') {
      filteredData = filteredData.filter(item => item.requestType === filters.requestType);
    }
    if (filters.requestOn !== 'all') {
      filteredData = filteredData.filter(item => item.requestOn === filters.requestOn);
    }

    setData(filteredData);
  }, [filters, originalData]);

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
            const params = {
              voucherType: details.voucherType,
              voucherNo: details.voucherNo,
              year: details.financialYear || new Date().getFullYear().toString(),
              particulars: details.particulars || 'Custom'
            };

            console.log('Delete receipt params:', params);

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
      throw error;
    }
  };

  const handleApproval = async (approval) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/approvalsRoute/update-status/${approval._id}`, {
        status: 'approved'
      });

      const res = await axios.get('http://localhost:5000/api/approvalsRoute');
      setOriginalData(res.data);
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
      
      const res = await axios.get('http://localhost:5000/api/approvalsRoute');
      setOriginalData(res.data);
      setData(res.data);
      
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

  const uniqueRequestTypes = [...new Set(originalData.map(item => item.requestType))];
  const uniqueRequestOn = [...new Set(originalData.map(item => item.requestOn))];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Approval Requests</h1>
          
          <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              className="border rounded p-2"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              className="border rounded p-2"
              value={filters.user}
              onChange={(e) => setFilters({...filters, user: e.target.value})}
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user._id} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>

            <select
              className="border rounded p-2"
              value={filters.requestType}
              onChange={(e) => setFilters({...filters, requestType: e.target.value})}
            >
              <option value="all">All Request Types</option>
              {uniqueRequestTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              className="border rounded p-2"
              value={filters.requestOn}
              onChange={(e) => setFilters({...filters, requestOn: e.target.value})}
            >
              <option value="all">All Request On</option>
              {uniqueRequestOn.map(on => (
                <option key={on} value={on}>{on}</option>
              ))}
            </select>
          </div>

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
                      ) : null
                    )}
                    {item.requestOn.toLowerCase() === 'payment' && (
                      item.requestType === 'update' ? (
                        <RequestUpdatePayment 
                          newPayment={item.details}
                          approval={item}
                          setApprovalData={setData}
                        />
                      ) : item.requestType === 'delete' ? (
                        <RequestDeletePayment 
                          newPayment={item.details}
                          approval={item}
                          setApprovalData={setData}
                        />
                      ) : null
                    )}
                    {item.requestOn.toLowerCase() === 'fdr' && (
                      item.requestType === 'update' ? (
                        <RequestUpdateFDR 
                          newFdr={item.details}
                          approval={item}
                          setApprovalData={setData}
                        />
                      ) : item.requestType === 'delete' ? (
                        <RequestDeleteFDR 
                          newFdr={item.details}
                          approval={item}
                          setApprovalData={setData}
                        />
                      ) : null
                    )}
                    {item.requestOn.toLowerCase() === 'unit' && (
                      item.requestType === 'update' ? (
                        <RequestUpdateUnit 
                          newUnit={item.details}
                          approval={item}
                          setApprovalData={setData}
                        />
                      ) : item.requestType === 'delete' ? (
                        <RequestDeleteUnit 
                          newUnit={item.details}
                          approval={item}
                          setApprovalData={setData}
                        />
                      ) : null
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
    </>
  );
};

export default ApprovalsPage;