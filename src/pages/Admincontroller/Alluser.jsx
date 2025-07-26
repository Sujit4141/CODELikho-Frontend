import { useState, useEffect } from "react";
import Navbar from "../../../componenets/Navbar";
import axiosClient from "../../utils/axiosClient";
import {
  FiUser,
  FiStar,
  FiBook,
  FiShield,
  FiUserCheck,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

function Alluser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("user/getallprofile");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [users]);

 const updaterole = async (userId, newRole) => {
  try {
    const response = await axiosClient.patch(`user/update/${userId}`, {
      role: newRole,
    });
    
    // Optionally refresh the user list here
  } catch (err) {
    console.error("Error updating role:", err);
    throw err;
  }
};


  const premiumUsers = users.filter(
    (user) => user.problemSolved && user.problemSolved.length > 0
  ).length;

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.emailId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    axiosClient.delete(`/user/deleteProfile/${selectedUser._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage all platform users and their permissions
            </p>
          </div>

          <div className="mt-6 md:mt-0 w-full md:w-auto flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full md:w-80 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiUser className="absolute right-3 top-3 text-gray-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-lg">
                <div className="flex items-center">
                  <div className="bg-cyan-900/30 p-2 rounded-lg mr-3">
                    <FiUser className="text-cyan-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="font-bold text-lg text-white">
                      {users.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-lg">
                <div className="flex items-center">
                  <div className="bg-amber-900/30 p-2 rounded-lg mr-3">
                    <FaCrown className="text-amber-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Premium Users</p>
                    <p className="font-bold text-lg text-white">
                      {premiumUsers}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/60">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                      Problems Solved
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-800/30" : "bg-gray-800/10"
                      } hover:bg-gray-800/50 transition-all duration-200`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-700 p-2 rounded-lg mr-3">
                            <FiUser className="text-cyan-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {user.firstName}
                            </div>
                            <div className="text-sm text-gray-400 truncate max-w-xs">
                              {user.emailId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.problemSolved && user.problemSolved.length > 0 ? (
                          <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-amber-900/30 text-amber-300">
                            <FaCrown className="mr-1" /> Premium
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-gray-700 text-gray-300">
                            Free Tier
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role === "admin" ? (
                          <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-purple-900/30 text-purple-300">
                            <FiShield className="mr-1" /> Admin
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-900/30 text-blue-300">
                            <FiUserCheck className="mr-1" /> User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center">
                          <FiBook className="mr-2 text-cyan-400" />
                          {user.problemSolved?.length || 0} problems
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-cyan-400 hover:text-cyan-300 mr-4 transition-colors"
                          onClick={() => handleEditClick(user)}
                        >
                          <FiEdit className="inline mr-1" /> Edit
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300 transition-colors"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <FiTrash2 className="inline mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gray-800/50 rounded-xl p-8 mx-auto max-w-md border border-gray-700">
                    <FiUser className="text-5xl text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-300">
                      No users found
                    </h3>
                    <p className="text-gray-500 mt-2">
                      {searchTerm
                        ? "Try a different search term"
                        : "No users available"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full border border-cyan-500/30 shadow-xl shadow-cyan-900/20 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-cyan-400">Edit User</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-gray-700 p-3 rounded-full mr-3">
                  <FiUser className="text-cyan-400" />
                </div>
                <div>
                  <div className="text-lg font-medium text-white">
                    {selectedUser.firstName}
                  </div>
                  <div className="text-sm text-gray-400">
                    {selectedUser.emailId}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Role
                  </label>
                  <select
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={selectedRole || selectedUser.role}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await updaterole(
                      selectedUser._id,
                      selectedRole || selectedUser.role
                    );
                    alert("✅ Role updated successfully!");
                    setShowEditModal(false);
                  } catch (err) {
                    console.error(err);
                    alert("❌ Failed to update role.");
                  }
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full border border-red-500/30 shadow-xl shadow-red-900/20 animate-fadeIn">
            <div className="text-center">
              <div className="mx-auto bg-red-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FiTrash2 className="text-2xl text-red-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Confirm Deletion
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">
                  {selectedUser.firstName}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Alluser;
