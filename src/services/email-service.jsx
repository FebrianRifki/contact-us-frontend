import api from "@/api/axios";

class EmailService {
    async sendEmail(emailData) {
        try {
            const response = await api.post("/send-email", emailData);
            return response.data;
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }

    async getAllEmails() {
        try {
            const response = await api.get("/emails");
            return response.data;
        } catch (error) {
            console.error("Error fetching emails:", error);
            throw error;
        }
    }

    async getEmailById(emailId) {
        try {
            const response = await api.get(`/email/${emailId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching email by ID:", error);
            throw error;
        }
    }

    async updateEmailStatus(emailId, status) {
        try {
            const response = await api.put(`/email/${emailId}`, status);
            return response.data;
        } catch (error) {
            console.error("Error updating email status:", error);
            throw error;
        }
    }

    async reply(emailId, payload) {
        try {
            const response = await api.post(`email/reply/${emailId}`, payload);
            return response.data;
        } catch (error) {
            console.error("Error occure when replying email", error);
            throw error;
        }
    }

    async getReplyMessage($id) {
        try {
            const response = await api.get(`/email/reply/${$id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching reply message:", error);
            throw error;
        }
    }

    async deleteEmail(emailId) {
        try {
            const response = await api.delete(`/email/${emailId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting email:", error);
            throw error;
        }
    }
}


export default new EmailService();