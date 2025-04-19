import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import adminService from "./adminService";
import { toast } from "react-toastify";
import { RootState } from "../../app/store";
import { Admin } from "../../types/admin.types";
import { User } from "../../types/user.types";
import { AdminState } from "../../types/admin.types";

const storedAdmin = localStorage.getItem("admin");
const admin = storedAdmin ? JSON.parse(storedAdmin) : null;
const initialState: AdminState = {
  admin,
  users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Admin login
export const adminLogin = createAsyncThunk(
  "admin/login",
  async (credentials: Admin, thunkAPI) => {
    try {
      const response = await adminService.login(credentials);
      toast.success("Admin Login Successful");
      return response;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Admin logout
export const adminLogout = createAsyncThunk("admin/logout", async () => {
  adminService.logout();
  toast.info("Admin logged out successfully");
});

// Get all users
export const getUsers = createAsyncThunk(
  "admin/getUsers",
  async (_, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).admin.admin?.token;
      if (!token) {
        throw new Error("No token found");
      }
      return await adminService.getUsers(token);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId: string, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).admin.admin?.token;
      if (!token) {
        throw new Error("No token found");
      }
      return await adminService.deleteUser(userId, token);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create user
export const createUser = createAsyncThunk(
  "admin/createUser",
  async (userData: User, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).admin.admin?.token;
      if (!token) {
        throw new Error("No token found");
      }
      return await adminService.createUser(userData, token);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async (
    { userId, userData }: { userId: string; userData: User },
    thunkAPI
  ) => {
    try {
      const token = (thunkAPI.getState() as RootState).admin.admin?.token;
      if (!token) {
        throw new Error("No token found");
      }
      return await adminService.updateUser(userId, userData, token);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdmin: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.admin = action.payload;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as string;
        state.admin = null;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.admin = null;
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as string;
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "User created successfully";
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "User updated successfully";
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "User deleted successfully";
        state.users = state.users.filter(
          (user) => user._id !== action.meta.arg
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as string;
      });
  },
});

export const { resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;
