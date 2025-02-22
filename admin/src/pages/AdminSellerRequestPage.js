import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Loader2, CheckCircle, XCircle, User, Mail } from "lucide-react";

const AdminSellerRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/seller-requests"
      );
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching seller requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (sellerId, currentStatus) => {
    const newStatus = currentStatus === "approved" ? "rejected" : "approved";
    try {
      await axios.post(
        "http://localhost:5000/api/admin/update-request-status",
        {
          sellerId,
          status: newStatus,
        }
      );
      fetchRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      alert("An error occurred while updating the request status.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Seller Requests
          </h1>
          {requests.filter((req) => req.status === "pending").length > 0 && (
            <div className="animate-pulse bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
              {requests.filter((req) => req.status === "pending").length} New
              Request(s)
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <Loader2 className="animate-spin text-gray-500 w-10 h-10" />
          </div>
        ) : (
          <>
            {/* Pending Requests */}
            <div className="bg-yellow-100 shadow-lg rounded-xl p-6 border border-yellow-300 mb-6">
              <h2 className="text-2xl font-bold text-yellow-700 mb-4">
                Pending Requests
              </h2>
              {requests.filter((req) => req.status === "pending").length ===
              0 ? (
                <p className="text-gray-600 text-lg">
                  No pending seller requests.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-yellow-200 text-yellow-900">
                        <th className="p-3 text-left">Username</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests
                        .filter((req) => req.status === "pending")
                        .map((request) => (
                          <tr
                            key={request._id}
                            className="border-b hover:bg-yellow-50 transition"
                          >
                            <td className="p-4 font-medium flex items-center gap-2">
                              <User className="text-gray-600 w-5 h-5" />
                              {request.username}
                            </td>
                            <td className="p-4 font-medium flex items-center gap-2">
                              <Mail className="text-gray-600 w-5 h-5" />
                              {request.email}
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex justify-center gap-4">
                                <button
                                  onClick={() =>
                                    handleToggleStatus(request._id, "approved")
                                  }
                                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleToggleStatus(request._id, "rejected")
                                  }
                                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600"
                                >
                                  <XCircle className="w-5 h-5" />
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Processed Requests */}
            <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Processed Requests
              </h2>
              {requests.filter((req) => req.status !== "pending").length ===
              0 ? (
                <p className="text-gray-600 text-lg">No processed requests.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200 text-gray-700">
                        <th className="p-3 text-left">Username</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests
                        .filter((req) => req.status !== "pending")
                        .map((request) => (
                          <tr
                            key={request._id}
                            className={`border-b transition ${
                              request.status === "approved"
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                          >
                            <td className="p-4 font-medium flex items-center gap-2">
                              <User className="text-gray-600 w-5 h-5" />
                              {request.username}
                            </td>
                            <td className="p-4 font-medium items-center gap-2">
                              <Mail className="text-gray-600 w-5 h-5 -ml-7 -mb-6" />
                              {request.email}
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-4">
                                {/* Status Icon & Label */}
                                <div className="flex items-center gap-2">
                                  {request.status === "approved" ? (
                                    <>
                                      <CheckCircle className="text-green-600 w-6 h-6" />
                                      <span className="font-semibold text-sm uppercase text-green-800">
                                        Approved
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="text-red-600 w-6 h-6" />
                                      <span className="font-semibold text-sm uppercase text-red-800">
                                        Rejected
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex justify-center">
                                <button
                                  onClick={() =>
                                    handleToggleStatus(
                                      request._id,
                                      request.status === "approved"
                                        ? "approved"
                                        : "rejected"
                                    )
                                  }
                                  className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-white ${
                                    request.status === "approved"
                                      ? "bg-red-500 hover:bg-red-600"
                                      : "bg-green-500 hover:bg-green-600"
                                  }`}
                                >
                                  {request.status === "approved" ? (
                                    <>
                                      <XCircle className="w-5 h-5" />
                                      Reject
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-5 h-5" />
                                      Approve
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSellerRequestsPage;
