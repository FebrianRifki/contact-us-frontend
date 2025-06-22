import axios from "axios";

// Buat instance Axios
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
        Accept: 'application/json',
    },
});

// Interceptor
api.interceptors.request.use(
    (config) => {
        const excludedPaths = ["/login", "/send-email"];
        const isExcluded = excludedPaths.some(path => config.url.includes(path));

        if (!isExcluded) {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;