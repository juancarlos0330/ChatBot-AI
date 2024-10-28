import axios from "axios";
import { apiURL } from "../config/config";

// get chat history by email
export const getChatHistory = async (email) => {
  try {
    const response = await axios.post(`${apiURL}/chats/history`, {
      email,
    });
    return response;
  } catch (error) {
    console.log(error);
    return "error";
  }
};
