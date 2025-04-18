import axios, { AxiosError } from "axios";
import { Admin } from "../../types/admin.types";
import { User} from "../../types/user.types";
const API_URL = "http://localhost:3000/api/admin/";

const login = async (adminData: Admin) => {
  try {
    const response = await axios.post(API_URL + "login", adminData);
    if (response.data) {
      localStorage.setItem("admin", JSON.stringify(response.data));
    }
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Admin Login error", error.response?.data || error.message);
    throw error;
  }
};

const logout = async () => {
  try {
    await axios.post(API_URL + "logout");
  } catch (error) {
    console.warn("Admin Logout request failed:", error);
  }
  localStorage.removeItem("user");
};

//done
const getUsers = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + "users", config);
  return response.data;
};

const createUser = async (userData: User, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + "users", userData, config);
  return response.data;
};

const updateUser = async (id: string, userData: User, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + `users/${id}`, userData, config);
  return response.data;
};

const deleteUser = async (id: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + `users/${id}`, config);
  return response.data;
};

export default { login, logout, getUsers, createUser, updateUser, deleteUser };
