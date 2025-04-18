import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";
import { RootState } from "../../app/store";
import { User } from "../../types/user.types";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Update user profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData: User, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user.token;
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
