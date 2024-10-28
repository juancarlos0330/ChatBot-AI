import axios from "axios";
import { apiURL } from "../config/config";

export const signIn = async (email) => {
  try {
    const response = await axios.post(`${apiURL}/users/signin`, {
      email,
    });
    return response;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

export const adminSignIn = async (email) => {
  try {
    const response = await axios.post(`${apiURL}/admin/signin`, {
      email,
    });
    return response;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

export const getUserListAPI = async () => {
  try {
    const response = await axios.get(`${apiURL}/admin/userlist`);
    return response;
  } catch (error) {
    console.log(error);
    return "error";
  }
};
