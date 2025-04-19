import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { adminLogout } from "../features/admin/adminSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(adminLogout());
  };
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create user");
  };
  const handleEditUser = (user: any) => {
    console.log("Edit", user);
    setShowEditModal(true);
  };
  const handleDeleteUser = (id: string, name: string) =>
    console.log("Delete", id, name);
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update user");
  };

  const admin = { email: "admin@example.com" };
  const filteredUsers = [
    {
      _id: "1",
      name: "Alice",
      email: "alice@example.com",
      createdAt: new Date().toISOString(),
      profileImage: "",
    },
    {
      _id: "2",
      name: "Bob",
      email: "bob@example.com",
      createdAt: new Date().toISOString(),
      profileImage: "",
    },
  ];

  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editUserData, setEditUserData] = useState({ name: "" });

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="navbar bg-primary text-primary-content px-4">
        <div className="flex-1">
          <a className="text-xl font-bold">Admin Dashboard</a>
        </div>
        <div className="flex items-center space-x-4">
          <span>{admin?.email}</span>
          <button onClick={handleLogout} className="btn btn-error text-white">
            Logout
          </button>
        </div>
      </div>

      <div className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="card-title">User Management</h2>
                  <p className="text-sm text-gray-500">
                    List of all registered users
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create User
                </button>
              </div>

              <div className="form-control my-4">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Created At</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-10 rounded-full bg-base-200">
                                <span className="text-lg font-bold flex items-center justify-center w-full h-full">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div>{user.name}</div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="btn btn-sm btn-primary mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteUser(user._id, user.name)
                              }
                              className="btn btn-sm btn-error"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered w-full"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit User</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4 mt-4">
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered w-full"
                value={editUserData.name}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, name: e.target.value })
                }
                required
              />
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
