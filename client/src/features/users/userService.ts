import axios from "axios";
import { User } from "../../types/user.types";

const API_URL = "http://localhost:3000/api/users";

const updateProfile = async (userData: Partial<User>, token: string) => {
  console.log("Updating profile with data:", userData);

  try {
    const response = await axios.put(`${API_URL}/update-profile`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const updatedData = response.data;
    console.log("Response from server:", updatedData);

    // Update user in localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Current user in localStorage:", user);

    const updatedUser = {
      ...user,
      name: userData.name,
      profileImage: userData.profileImage,
    };
    console.log("Updated user object:", updatedUser);

    localStorage.setItem("user", JSON.stringify(updatedUser));

    return updatedUser;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update profile";
    throw new Error(message);
  }
};

export default { updateProfile };
