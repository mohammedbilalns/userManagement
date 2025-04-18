import axios, { AxiosError } from "axios";
import { UserType } from "../../types/userType";

const API_URL = "http://localhost:3000/api/user";

const register = async (userData: UserType) => {
  try {
    const response = await axios.post(API_URL + "/register", userData);
    if (response.data) {
      storeUser(response.data);
    }

    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};

const login = async (userData: UserType) => {
  try {
    const response = await axios.post(API_URL + "/login", userData);

    if (response.data) {
      storeUser(response.data);
    }

    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

const logout = async () => {
  try {
    await axios.post(API_URL + "/logout");
  } catch (error) {
    console.warn("Logout request failed:", error);
  }
  localStorage.removeItem("user");
};

const storeUser = (data: any) => {
  localStorage.setItem("user", JSON.stringify(data));
};
export default { register, login, logout };
