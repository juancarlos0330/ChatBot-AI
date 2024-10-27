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
