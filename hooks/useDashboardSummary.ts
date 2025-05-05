// src/hooks/useDashboardSummary.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const res = await api.get("/dashboard/summary");
      return res.data;
    },
  });
};
