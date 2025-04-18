import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { UserType } from "../../types/userType";
import authService from "./authService";
import { AxiosError } from "axios";

const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

const initialState = {
  user: user ? user : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData: UserType, thunkApi) => {
    try {
      const response = await authService.register(userData);
      toast.success("Registration success");
      return response;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(message);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData: UserType, thunkAPI) => {
    try {
      const response = await authService.login(userData);
      toast.success("Login successful!");
      return response;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      const message =
        error.response?.data?.message || error.message || "Invalid credentials";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  authService.logout();
  toast.info("Logged out successfully");
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset, updateUser } = authSlice.actions;
export default authSlice.reducer;
