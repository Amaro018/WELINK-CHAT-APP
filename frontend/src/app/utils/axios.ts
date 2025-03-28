import axios from "axios";

console.log("API_PATH in next.config.ts:", process.env.NEXT_PUBLIC_API_PATH);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_PATH,
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error?.response?.status === 401 &&
      error?.response?.data?.message === "The provided token has expired." &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/api/auth/token/renew");
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        localStorage.setItem("accessToken", response.data.accessToken);

        return api(originalRequest);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("accessToken");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
