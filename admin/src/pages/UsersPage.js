import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Switch } from "@headlessui/react";
import PopupMsg from "./PopupMsg";
import { CheckCircle, XCircle, User, Mail } from "lucide-react";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupMsg, setPopupMsg] = useState({ message: "", type: "", show: false });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/users");
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId, isActive) => {
    try {
      await axios.put(`http://localhost:5000/admin/users/${userId}/status`, {
        isActive: !isActive,
      });

      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isActive: !isActive } : user
        )
      );

      setPopupMsg({
        message: `User ${isActive ? "blocked" : "activated"} successfully`,
        type: "success",
        show: true,
      });

      setTimeout(() => {
        setPopupMsg((prev) => ({ ...prev, show: false }));
      }, 3000);
    } catch (err) {
      setPopupMsg({
        message: "Failed to update user status",
        type: "error",
        show: true,
      });

      setTimeout(() => {
        setPopupMsg((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-700 text-xl">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10 text-xl">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="w-full md:w-3/4 p-4 md:p-8">
        {popupMsg.show && <PopupMsg type={popupMsg.type} message={popupMsg.message} />}
        <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center text-gray-900">Users List</h1>

        <div className="overflow-x-auto bg-white p-4 md:p-6 shadow-lg rounded-xl">
          <table className="w-full border-collapse table-auto text-sm md:text-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-2 md:p-4 text-left">No</th>
                <th className="p-2 md:p-4 text-left">Username</th>
                <th className="p-2 md:p-4 text-left">Email</th>
                <th className="p-2 md:p-4 text-center">Status</th>
                <th className="p-2 md:p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-b hover:bg-gray-100 transition duration-200">
                  <td className="p-2 md:p-4 text-gray-700">{index + 1}</td>
                  <td className="p-2 md:p-4 text-gray-900 flex items-center gap-2 whitespace-nowrap min-w-[120px]">
                    <User className="text-gray-600" size={18} />
                    <span className="truncate">{user.username}</span>
                  </td>
                  <td className="p-2 md:p-4 text-gray-700 whitespace-nowrap min-w-[180px]">
                    <Mail className="text-gray-600 mr-2 md:-ml-6 md:-mb-6" size={18} />
                    <span className="truncate">{user.email}</span>
                  </td>
                  <td className="p-2 md:p-4 text-center">
                    {user.isActive ? (
                      <span className="flex items-center justify-center bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs md:text-sm">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center justify-center bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs md:text-sm">
                        <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                        Blocked
                      </span>
                    )}
                  </td>
                  <td className="p-2 md:p-4 text-center">
                    <Switch
                      checked={user.isActive}
                      onChange={() => toggleUserStatus(user._id, user.isActive)}
                      className={`${
                        user.isActive ? "bg-green-500" : "bg-red-500"
                      } relative inline-flex h-6 md:h-7 w-12 md:w-14 items-center rounded-full transition`}
                    >
                      <span
                        className={`${
                          user.isActive ? "translate-x-7 md:translate-x-8" : "translate-x-1"
                        } inline-block h-4 md:h-5 w-4 md:w-5 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
