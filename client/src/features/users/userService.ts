import axios from "axios";
import { User } from "../../types/user.types";

const API_URL = "http://localhost:3000/api/user";

const updateProfile = async (userData: Partial<User>, token: string) => {
  console.log("Updating profile with data:", userData);

  try {
    const response = await axios.put(`${API_URL}/update-profile`, {
      name: userData.name,
      profileImage: userData.profileImage
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const updatedData = response.data;
    console.log("Response from server:", updatedData);

    if (!updatedData) {
      throw new Error("No data received from server");
    }

    // Update user in localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = {
      ...user,
      name: updatedData.name,
      profileImage: updatedData.profileImage,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    const message = error.response?.data?.message || error.message || "Failed to update profile";
    throw new Error(message);
  }
};

const verifyUser = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error verifying user:", error);
    const message = error.response?.data?.message || error.message || "Failed to verify user";
    throw new Error(message);
  }
};

export default { updateProfile, verifyUser };
