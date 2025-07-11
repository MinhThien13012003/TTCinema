// src/store/authStore.js
import { create } from "zustand";
import axios from "../service/axios";
const storedUser = JSON.parse(localStorage.getItem("user") || "null");
const storedToken = localStorage.getItem("token");

export const useAuthStore = create((set) => ({
  isSubmitting: false,
  error: null,
  token: storedToken,
  user: storedUser,

  register: async (formData) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await axios.post("/api/auth/register", formData);
      set({ isSubmitting: false });
      return response.data;
    } catch (error) {
      console.error("Lỗi backend:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Lỗi đăng ký (500)";
      set({ isSubmitting: false, error: message });
      throw new Error(message);
    }
  },
  login: async (email, password) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token, user } = res.data;

      // Lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      set({ user, token, isSubmitting: false });
      return { user, token };
    } catch (err) {
      const message = err.response?.data?.message || "Đăng nhập thất bại";
      set({ error: message, isSubmitting: false });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
