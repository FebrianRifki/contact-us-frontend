import api from "../api/axios";

class AuthService {
    async login(credentials) {
        try {
            const response = await api.post("/login", credentials);
            return response.data
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    }
    async logout() {
        try {
            const response = await api.post("/logout");
            if (response.status === 200) {
                localStorage.removeItem("token");
                localStorage.removeItem("admin");
                return true;
            }
        } catch (error) {
            console.error("Logout error:", error);
            return false;
        }
    }
}

export default new AuthService();