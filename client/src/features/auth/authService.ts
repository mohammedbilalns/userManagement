import axios from "axios";
import { UserType } from "../../types/userType";

const API_URL = "http://localhost:3000/api/user";

const register = async (userData: UserType) => {
  const response = await axios.post(API_URL +"/register", userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData: UserType) => {
  const response = await axios.post(API_URL + "login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

export default { register, login, logout };
