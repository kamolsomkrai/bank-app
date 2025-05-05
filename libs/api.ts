// src/libs/api.ts

import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "./auth";

// สร้าง axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ถ้าจำเป็นต้องส่งคุกกี้
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: แนบ Authorization header
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: ถ้า 401 ให้ลอง refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // เช็คว่าเป็น 401 และยังไม่เคย retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // ดึง refresh token
        const refresh = getRefreshToken();
        if (!refresh) throw new Error("No refresh token");

        // เรียก API /auth/refresh
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refresh_token: refresh },
          { headers: { "Content-Type": "application/json" } }
        );

        const { access_token, refresh_token } = res.data;
        // บันทึก token ใหม่
        saveTokens(access_token, refresh_token);

        // แนบ header ใหม่ แล้ว retry request เดิม
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // ถ้า refresh ไม่สำเร็จ ⇒ เคลียร์ token และ redirect ไป login
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // กรณีอื่น ๆ
    return Promise.reject(error);
  }
);

export default api;
