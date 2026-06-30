import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const role = sessionStorage.getItem("currentRole");

  let token = "";

  switch (role) {
    case "shop":
      token = localStorage.getItem("shopToken");
      break;

    case "customer":
      token = localStorage.getItem("customerToken");
      break;

    case "deliveryPartner":
      token = localStorage.getItem("deliveryPartnerToken");
      break;

    default:
      token = "";
  }
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
        console.log(res, "res..");
        const newToken = res.data.accessToken;
        const role = res.data.role;

        switch (role) {
          case "shop":
            localStorage.setItem("shopToken", newToken);
            localStorage.setItem("shop", JSON.stringify(res.data.user));
            break;

          case "customer":
            localStorage.setItem("customerToken", newToken);
            localStorage.setItem("customer", JSON.stringify(res.data.user));
            break;

          case "deliveryPartner":
            localStorage.setItem("deliveryPartnerToken", newToken);

            localStorage.setItem(
              "deliveryPartner",
              JSON.stringify(res.data.deliveryPartner),
            );
            break;
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("shopToken");
        localStorage.removeItem("customerToken");
        localStorage.removeItem("deliveryPartnerToken");

        localStorage.removeItem("shop");
        localStorage.removeItem("customer");
        localStorage.removeItem("deliveryPartner");

        sessionStorage.removeItem("currentRole");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
