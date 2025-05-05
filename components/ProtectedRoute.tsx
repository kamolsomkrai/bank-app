// components/ProtectedRoute.tsx
"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { Skeleton } from "./ui/Skeleton"; // หรือจะแสดง null ก็ได้

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      // ถ้ายังไม่ได้ล็อกอิน ให้พาไปหน้า signIn
      signIn(undefined, { callbackUrl: "/" });
    }
  }, [status]);

  if (status === "loading") {
    // รอการโหลด session: แสดง skeleton หรือ spinner
    return <Skeleton className="h-8 w-full" />;
  }

  if (status === "unauthenticated") {
    // กำลังพาไปล็อกอิน: ไม่แสดง children
    return null;
  }

  // authenticated
  return <>{children}</>;
}
