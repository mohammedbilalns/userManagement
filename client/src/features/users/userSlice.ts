import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";
import { RootState } from "../../app/store";
import { User } from "../../types/user.types";
import { verifyUser } from "../auth/authSlice";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData: Partial<User>, thunkAPI) => {
    try {
      // verify if user still exists
      await thunkAPI.dispatch(verifyUser());
      
      const token = (thunkAPI.getState() as RootState).auth.user?.token;
      if (!token) {
        throw new Error("No token found");
      }
      return await userService.updateProfile(userData, token);
    } catch (err) {
      const error = err as Error;
      const message = error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserStatus: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetUserStatus } = userSlice.actions;
export default userSlice.reducer;
