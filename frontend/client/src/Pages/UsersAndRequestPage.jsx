import React, { useState } from "react";

const UsersAndRequestPage = () => {
  // Sample user data
  const [users, setUsers] = useState([
    { username: "john_doe", designation: "Admin", password: "admin123" },
    { username: "jane_doe", designation: "Manager", password: "manager456" },
    { username: "mark_twain", designation: "Developer", password: "dev789" },
    { username: "mark_twain", designation: "Developer", password: "dev789" },
  ]);

  // Sample requests
  const [requests, setRequests] = useState([
    { id: 1, text: "Request for system upgrade" },
    { id: 2, text: "Request for password reset" },
  ]);

  // Handle request action
  const handleRequestAction = (id, action) => {
    if (action === "accept") {
      alert(`Request ${id} accepted!`);
    } else if (action === "reject") {
      alert(`Request ${id} rejected!`);
    }
    // Remove the request from the list
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  return (
    <div className="p-4">
      {/* Users Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        {users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition"
              >
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Designation:</strong> {user.designation}
                </p>
                <p>
                  <strong>Password:</strong> {user.password}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No users available.</p>
        )}
      </div>

      {/* Requests Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Requests</h2>
        {requests.length > 0 ? (
          <ul className="space-y-4">
            {requests.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between border rounded-lg p-4 shadow hover:shadow-lg transition"
              >
                <span>{request.text}</span>
                <div className="space-x-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    onClick={() => handleRequestAction(request.id, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    onClick={() => handleRequestAction(request.id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No requests available.</p>
        )}
      </div>
    </div>
  );
};

export default UsersAndRequestPage;