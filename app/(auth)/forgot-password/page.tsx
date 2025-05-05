"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // เรียก API ขอ reset password จริง
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("ไม่พบอีเมลนี้ในระบบ");

      toast.success("ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลเรียบร้อยแล้ว!");
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการส่งอีเมล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
          ลืมรหัสผ่าน
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอก Email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
          >
            {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ต"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          © {new Date().getFullYear()} Bank System. All rights reserved.
        </div>
      </div>
    </div>
  );
}
