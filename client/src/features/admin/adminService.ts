import axios from "axios";
import { AdminType } from "../../types/adminType";
import { UserType } from "../../types/userType";
const API_URL = "http://localhost:3000/api/admin";

const login = async (adminData: AdminType) => {
  const response = await axios.post(API_URL + "login", adminData);
  if (response.data) {
    localStorage.setItem("admin", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("admin");
};

const getUsers = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + "users", config);
  return response.data;
};

const createUser = async (userData: UserType, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + "users", userData, config);
  return response.data;
};

const updateUser = async (id: string, userData: UserType, token: string) => {
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
