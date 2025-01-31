import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Switch } from "@headlessui/react";
import PopupMsg from "./PopupMsg";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupMsg, setPopupMsg] = useState({
    message: "",
    type: "",
    show: false,
  });

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

      setUsers(users.map(user => (user._id === userId ? { ...user, isActive: !isActive } : user)));

      setPopupMsg({
        message: `User ${isActive ? "blocked" : "activated"} successfully`,
        type: "success",
        show: true,
      });

      // Hide popup after 3 seconds
      setTimeout(() => {
        setPopupMsg(prev => ({ ...prev, show: false }));
      }, 3000);
      
    } catch (err) {
      setPopupMsg({
        message: "Failed to update user status",
        type: "error",
        show: true,
      });

      // Hide error message after 3 seconds
      setTimeout(() => {
        setPopupMsg(prev => ({ ...prev, show: false }));
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="w-3/4 p-8">
        {popupMsg.show && <PopupMsg type={popupMsg.type} message={popupMsg.message} />}
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">Users List</h1>
        <div className="overflow-x-auto bg-white p-6 shadow-lg rounded-xl">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white text-lg">
                <th className="p-4 text-left">No</th>
                <th className="p-4 text-left">Username</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-b hover:bg-gray-100 transition duration-200">
                  <td className="p-4 text-lg text-gray-700">{index + 1}</td>
                  <td className="p-4 text-lg text-gray-900">{user.username}</td>
                  <td className="p-4 text-lg text-gray-700">{user.email}</td>
                  <td className={`p-4 text-lg font-semibold text-center ${user.isActive ? "text-green-600" : "text-red-600"}`}>
                    {user.isActive ? "Active" : "Blocked"}
                  </td>
                  <td className="p-4 text-center">
                    <Switch
                      checked={user.isActive}
                      onChange={() => toggleUserStatus(user._id, user.isActive)}
                      className={`${user.isActive ? "bg-green-500" : "bg-red-500"} relative inline-flex h-7 w-14 items-center rounded-full transition`}
                    >
                      <span className={`${user.isActive ? "translate-x-8" : "translate-x-1"} inline-block h-5 w-5 transform rounded-full bg-white transition`} />
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

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Sidebar from "./Sidebar";
// import { Switch } from "@headlessui/react";
// import PopupMsg from "./PopupMsg";

// const UsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [popupMsg, setPopupMsg] = useState({
//     message: "",
//     type: "",
//     show: false,
//   });

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/admin/users");
//         setUsers(res.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch users");
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const toggleUserStatus = async (userId, isActive) => {
//     try {
//       await axios.put(`http://localhost:5000/admin/users/${userId}/status`, {
//         isActive: !isActive,
//       });

//       setUsers(users.map(user => (user._id === userId ? { ...user, isActive: !isActive } : user)));

//       setPopupMsg({
//         message: `User ${isActive ? "blocked" : "activated"} successfully`,
//         type: isActive ? "error" : "success",  // Set error for blocked, success for activated
//         show: true,
//       });
      
//     } catch (err) {
//       setPopupMsg({
//         message: "Failed to update user status",
//         type: "error",
//         show: true,
//       });
//     }
//   };

//   // Automatically hide popup after 3 seconds when shown
//   useEffect(() => {
//     if (popupMsg.show) {
//       const timer = setTimeout(() => {
//         setPopupMsg(prev => ({ ...prev, show: false }));
//       }, 3000);

//       return () => clearTimeout(timer); // Cleanup on unmount
//     }
//   }, [popupMsg.show]);

//   if (loading) {
//     return <div className="text-center mt-10 text-gray-700 text-xl">Loading users...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500 mt-10 text-xl">{error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <Sidebar />
//       <div className="w-3/4 p-8">
//         {popupMsg.show && <PopupMsg type={popupMsg.type} message={popupMsg.message} />}
//         <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">Users List</h1>
//         <div className="overflow-x-auto bg-white p-6 shadow-lg rounded-xl">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-blue-600 text-white text-lg">
//                 <th className="p-4 text-left">No</th>
//                 <th className="p-4 text-left">Username</th>
//                 <th className="p-4 text-left">Email</th>
//                 <th className="p-4 text-center">Status</th>
//                 <th className="p-4 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user, index) => (
//                 <tr key={user._id} className="border-b hover:bg-gray-100 transition duration-200">
//                   <td className="p-4 text-lg text-gray-700">{index + 1}</td>
//                   <td className="p-4 text-lg text-gray-900">{user.username}</td>
//                   <td className="p-4 text-lg text-gray-700">{user.email}</td>
//                   <td className={`p-4 text-lg font-semibold text-center ${user.isActive ? "text-green-600" : "text-red-600"}`}>
//                     {user.isActive ? "Active" : "Blocked"}
//                   </td>
//                   <td className="p-4 text-center">
//                     <Switch
//                       checked={user.isActive}
//                       onChange={() => toggleUserStatus(user._id, user.isActive)}
//                       className={`${user.isActive ? "bg-green-500" : "bg-red-500"} relative inline-flex h-7 w-14 items-center rounded-full transition`}
//                     >
//                       <span className={`${user.isActive ? "translate-x-8" : "translate-x-1"} inline-block h-5 w-5 transform rounded-full bg-white transition`} />
//                     </Switch>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UsersPage;
