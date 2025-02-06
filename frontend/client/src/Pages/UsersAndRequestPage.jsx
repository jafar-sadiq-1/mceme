import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

const UsersAndRequestPage = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUserId, setEditUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, requestsRes] = await Promise.all([
          axios.get("http://localhost:5000/users"),
          axios.get("http://localhost:5000/user_approvals"),
        ]);
        setUsers(usersRes.data);
        setRequests(requestsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteUser = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete_user/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }, []);

  const updateUserRole = useCallback(async (id) => {
    if (!selectedRole) return alert("Please select a role.");
    try {
      await axios.put(`http://localhost:5000/update_toggler/${id}`, { toggler: selectedRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === id ? { ...user, toggler: selectedRole } : user))
      );
      setEditUserId(null);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  }, [selectedRole]);

  const handleRequestAction = useCallback(async (user, action) => {
    try {
      if (action === "accept") await axios.post("http://localhost:5000/add_users", user);
      await axios.delete(`http://localhost:5000/delete_approval/${user._id}`);
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== user._id));
    } catch (error) {
      console.error("Error handling request:", error);
    }
    window.location.reload();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">Users - {users.length}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user._id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
               <p><strong>Name :</strong> {user.firstName} {user.MiddleName} {user.lastName}</p>
              <p><strong>User ID :</strong> {user.username}</p>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Mobile Number :</strong> {user.mobileNumber}</p>
              <p><strong>Role :</strong> {user.toggler}</p>
              <button
                onClick={() => deleteUser(user._id)}
                className="mt-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              >Delete</button>
              
              <button
                onClick={() => setEditUserId(user._id)}
                className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
              >Update</button>

              {editUserId === user._id && (
                <div className="mt-2">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="border p-2 rounded-md"
                  >
                    <option value="">Select Role</option>
                    <option value="AE">AE</option>
                    <option value="E">E</option>
                    <option value="Viewer">Viewer</option>
                    <option value="Clerk">Clerk</option>
                  </select>
                  <button
                    onClick={() => updateUserRole(user._id)}
                    className="ml-2 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                  >Save</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mt-6 mb-4 text-center text-blue-500">Requests - {requests.length}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((user) => (
            <li key={user._id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
              <p><strong>Name :</strong> {user.firstName} {user.MiddleName} {user.lastName}</p>
              <p><strong>User ID :</strong> {user.username}</p>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Mobile Number :</strong> {user.mobileNumber}</p>
              <p><strong>Role :</strong> {user.toggler}</p>

              <div className="mt-2 space-x-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  onClick={() => handleRequestAction(user, "accept")}
                >Accept</button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => handleRequestAction(user, "reject")}
                >Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersAndRequestPage;
