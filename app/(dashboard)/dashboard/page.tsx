"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ProtectedRoute>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))
        ) : (
          <>
            <SummaryCard title="ยอดเงินคงเหลือรวม" value="5,000,000 บาท" />
            <SummaryCard title="ยอดฝากเงินรวม" value="8,000,000 บาท" />
            <SummaryCard title="ยอดถอนเงินรวม" value="3,000,000 บาท" />
            <SummaryCard title="จำนวนบัญชีทั้งหมด" value="120 บัญชี" />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (

    <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition">
      <h2 className="text-gray-700 font-semibold text-lg">{title}</h2>
      <p className="text-blue-600 text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
