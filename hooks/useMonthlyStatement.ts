// src/hooks/useMonthlyStatement.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api";

export const useMonthlyStatement = (
  accountId: string,
  month: number,
  year: number,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["monthly-statement", accountId, month, year],
    queryFn: async () => {
      const res = await api.get(`/accounts/${accountId}/transactions`, {
        params: { month, year },
      });
      return res.data;
    },
    enabled: enabled && accountId.length > 0,
  });
};
