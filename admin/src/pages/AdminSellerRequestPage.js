import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const AdminSellerRequestsPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [processedRequests, setProcessedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRequestCount, setNewRequestCount] = useState(0);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/seller-requests");
      const pending = response.data.filter((req) => req.status === "pending");
      const processed = response.data.filter((req) => req.status !== "pending");
      if (pending.length > pendingRequests.length) {
        setNewRequestCount(pending.length - pendingRequests.length);
      }
      setPendingRequests(pending);
      setProcessedRequests(processed);
    } catch (error) {
      console.error("Error fetching seller requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(() => {
      fetchRequests();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestAction = async (sellerId, action) => {
    try {
      const response = await axios.post("http://localhost:5000/api/admin/approve-request", {
        sellerId,
        action,
      });
      alert(response.data.message);
      fetchRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      alert("An error occurred while updating the request status.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Seller Requests</h1>
          {newRequestCount > 0 && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              {newRequestCount} New Request{newRequestCount > 1 ? "s" : ""}
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Pending Requests</h2>
              {pendingRequests.length === 0 ? (
                <p className="text-gray-500">No pending requests.</p>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700">
                      <th className="p-3 text-left">Username</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((request) => (
                      <tr key={request._id} className="border-b hover:bg-gray-100">
                        <td className="p-3">{request.username}</td>
                        <td className="p-3">{request.email}</td>
                        <td className="p-3 text-center">
                          <button
                            className="bg-green-500 text-white px-4 py-1 rounded mr-2 hover:bg-green-600"
                            onClick={() => handleRequestAction(request._id, "approve")}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                            onClick={() => handleRequestAction(request._id, "reject")}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Processed Requests</h2>
              {processedRequests.length === 0 ? (
                <p className="text-gray-500">No approved or rejected requests.</p>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700">
                      <th className="p-3 text-left">Username</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedRequests.map((request) => (
                      <tr key={request._id} className="border-b hover:bg-gray-100">
                        <td className="p-3">{request.username}</td>
                        <td className="p-3">{request.email}</td>
                        <td className="p-3 text-center font-semibold text-sm uppercase"
                          style={{ color: request.status === "approved" ? "green" : "red" }}>
                          {request.status === "approved" ? "Approved" : "Rejected"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSellerRequestsPage;