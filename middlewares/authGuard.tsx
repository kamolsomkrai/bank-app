// src/middlewares/authGuard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) {
      toast.error("กรุณาเข้าสู่ระบบก่อนใช้งาน");
      router.push("/login");
    }
  }, [accessToken, router]);

  if (!accessToken) {
    return null; // ป้องกันการแสดงผลก่อน redirect เสร็จ
  }

  return <>{children}</>;
}
