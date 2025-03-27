import { User } from "../models/user";
import api from "../utils/axios";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
//LOGIN & SIGNUP
export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function getUser(): Promise<User | null> {
  const response = await api.get("/api/users", {
    withCredentials: true,
  });

  console.log("🔍 Headers Sent:", response.config.headers);
  console.log("🔍 Cookies Sent:", document.cookie);

  console.log("User fetched successfully:", response.data);
  return response.data;
}

export async function getAllUser(): Promise<User | null> {
  const response = await api.get("/api/users/all");
  return response.data;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await api.post("/api/users/signup", credentials);
  return response.data;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    console.log("🔐 Logging in with credentials:", credentials);

    const response = await api.post("/api/users/login", credentials, {
      withCredentials: true,
    });
    const user = response.data;

    console.log("✅ Login successful:", user);
    return user;
  } catch (error) {
    console.error("❌ Error logging in:", error);
    throw error;
  }
}

export async function logout() {
  try {
    await api.post("/api/users/logout", {}, { withCredentials: true });
    console.log("✅ Logout successful");
  } catch (error) {
    console.error("❌ Error logging out:", error);
  }
}
//LOGIN & SIGNUP

export async function updateUserInformation(
  userId: string,
  formData: FormData
): Promise<User> {
  console.log("Updating user with formData:", formData);

  const response = await api.put(`/api/users/update/${userId}`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data", // Ensure Multer processes the file correctly
    },
  });

  if (!response.status || response.status >= 400) {
    throw new Error(`Failed to update User: ${response.statusText}`);
  }

  console.log("User updated successfully");
  return response.data;
}
// Expose the socket globally so components can access it
export function getSocket(): Socket | null {
  return socket;
}
