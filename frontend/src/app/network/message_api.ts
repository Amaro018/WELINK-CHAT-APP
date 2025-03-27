// import { messages } from "../models/messages";
import api from "../utils/axios";

export async function sendMessage(receiverId: string, content: string) {
  const response = await api.post(
    "/api/messages/send/" + receiverId,
    { receiverId, content }, // Send correct payload
    { withCredentials: true }
  );
  return response.data;
}

export async function getUsersForSidebar() {
  const response = await api.get("/api/messages/users", {
    withCredentials: true,
  });
  return response.data;
}

export async function getMessages(receiverId: string) {
  const response = await api.get(`/api/messages/${receiverId}`, {
    withCredentials: true,
  });

  return response.data;
}
