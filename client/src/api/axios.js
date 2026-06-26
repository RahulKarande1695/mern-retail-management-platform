import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/refresh" &&
      originalRequest.url !== "/auth/verify-otp"
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh");
        console.log(res,"res..")
        const newToken = res.data.accessToken;
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("token");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
