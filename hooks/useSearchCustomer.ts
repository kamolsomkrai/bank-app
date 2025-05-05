// src/hooks/useSearchCustomer.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api";

export const useSearchCustomer = (keyword: string) => {
  return useQuery({
    queryKey: ["customers", keyword],
    queryFn: async () => {
      const res = await api.get(`/customers/search?keyword=${keyword}`);
      return res.data;
    },
    enabled: !!keyword, // เริ่ม fetch เมื่อมี keyword จริง
  });
};
