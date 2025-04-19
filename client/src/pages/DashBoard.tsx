import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import {
  getUsers,
  deleteUser,
  adminLogout,
  createUser,
  updateUser,
  resetAdmin,
} from "../features/admin/adminSlice";
import { RootState, AppDispatch } from "../app/store";
import { User } from "../types/user.types";
import LoadingSpinner from "../components/LoadingSpinner";

function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editUserData, setEditUserData] = useState<Partial<User>>({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation states
  const [createErrors, setCreateErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editErrors, setEditErrors] = useState({
    name: "",
  });

  const { admin, users, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.admin
  );

  // Memoize the fetch users function to prevent unnecessary rerenders
  const fetchUsers = useCallback(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    // Fetch users immediately when component mounts
    fetchUsers();
  }, [admin, navigate, fetchUsers]);

  // Separate effect for toast notifications to prevent unnecessary rerenders
  useEffect(() => {
    if (message) {
      toast.dismiss();

      if (isError) {
        toast.error(message);
      } else if (isSuccess) {
        toast.success(message);
        // Only reset submitting state when operation completes
        setIsSubmitting(false);
      }

      // Delay the reset to avoid UI flashing
      const timer = setTimeout(() => {
        dispatch(resetAdmin());
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleDeleteUser = (userId: string, userName: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${userName}. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result: { isConfirmed: boolean }) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(userId));
      }
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserData({ name: user.name });
    setShowEditModal(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEditForm() || isSubmitting) {
      return;
    }

    if (selectedUser?._id && editUserData.name) {
      setIsSubmitting(true);
      dispatch(
        updateUser({
          userId: selectedUser._id,
          userData: { ...selectedUser, name: editUserData.name },
        })
      ).then(() => {
        setShowEditModal(false);
        setSelectedUser(null);
        setEditErrors({ name: "" });
      });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCreateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const resultAction = await dispatch(createUser(newUser));
      if (createUser.fulfilled.match(resultAction)) {
        setShowCreateModal(false);
        setNewUser({ name: "", email: "", password: "" });
        setCreateErrors({ name: "", email: "", password: "" });
      } else if (createUser.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload as string;
        toast.error(errorMessage || "Failed to create user");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin/login");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateCreateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (!newUser.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    if (!newUser.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(newUser.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (!newUser.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (newUser.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setCreateErrors(newErrors);
    return isValid;
  };

  const validateEditForm = () => {
    let isValid = true;
    const newErrors = { name: "" };

    if (!editUserData.name?.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    setEditErrors(newErrors);
    return isValid;
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCreateErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setEditErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  if (!admin) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Navbar */}
      <div className="navbar bg-primary text-primary-content shadow-lg">
        <div className="flex-1">
          <a className="text-xl font-bold">Admin Dashboard</a>
        </div>
        <div className="flex items-center gap-4">
          <span>{admin?.email}</span>
          <button onClick={handleLogout} className="btn btn-error text-white">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
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
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
                disabled={isLoading}
              >
                Create User
              </button>
            </div>

            {/* Search Bar */}
            <div className="form-control my-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Add loading overlay only when needed */}
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-base-100 bg-opacity-50 flex items-center justify-center z-10">
                  <LoadingSpinner />
                </div>
              )}

              <div className="overflow-x-auto">
                {/* Fixed height container to prevent layout shifts */}
                <div className="min-h-[400px]">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th className="w-1/3">Name</th>
                        <th className="w-1/3">Email</th>
                        <th className="w-1/6">Created At</th>
                        <th className="text-right w-1/6">Actions</th>
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
                                    {user.name?.charAt(0).toUpperCase() ?? "?"}
                                  </span>
                                </div>
                              </div>
                              <div>{user.name}</div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="text-right">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="btn btn-sm btn-primary mr-2"
                                disabled={isSubmitting}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  user._id &&
                                  user.name &&
                                  handleDeleteUser(user._id, user.name)
                                }
                                className="btn btn-sm btn-error"
                                disabled={isSubmitting}
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
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label" htmlFor="name">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`input input-bordered w-full ${
                    createErrors.name ? "input-error" : ""
                  }`}
                  placeholder="Enter name"
                  value={newUser.name}
                  onChange={handleCreateInputChange}
                  disabled={isSubmitting}
                />
                {createErrors.name && (
                  <p className="text-error text-sm mt-1">{createErrors.name}</p>
                )}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="email">
                  <span className="label-text">Email</span>
                </label>
                <input
                  id="email"
                  name="email"
                  className={`input input-bordered w-full ${
                    createErrors.email ? "input-error" : ""
                  }`}
                  placeholder="Enter email"
                  value={newUser.email}
                  onChange={handleCreateInputChange}
                  disabled={isSubmitting}
                />
                {createErrors.email && (
                  <p className="text-error text-sm mt-1">
                    {createErrors.email}
                  </p>
                )}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="password">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`input input-bordered w-full ${
                    createErrors.password ? "input-error" : ""
                  }`}
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={handleCreateInputChange}
                  disabled={isSubmitting}
                />
                {createErrors.password && (
                  <p className="text-error text-sm mt-1">
                    {createErrors.password}
                  </p>
                )}
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs mr-2"></span>
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit User</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label" htmlFor="edit-name">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  className={`input input-bordered w-full ${
                    editErrors.name ? "input-error" : ""
                  }`}
                  placeholder="Enter name"
                  value={editUserData.name}
                  onChange={handleEditInputChange}
                  disabled={isSubmitting}
                />
                {editErrors.name && (
                  <p className="text-error text-sm mt-1">{editErrors.name}</p>
                )}
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs mr-2"></span>
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;