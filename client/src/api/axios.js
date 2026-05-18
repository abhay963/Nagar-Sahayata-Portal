import axios from "axios";

const instance = axios.create({

  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : "https://nagar.up.railway.app",

  withCredentials: true,
});


instance.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

export default instance;