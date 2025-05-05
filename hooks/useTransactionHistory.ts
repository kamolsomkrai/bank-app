// src/hooks/useTransactionHistory.ts
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/libs/api";

export const useTransactionHistory = (accountId: string, txType?: string) => {
  return useInfiniteQuery({
    queryKey: ["transactions", accountId, txType],
    queryFn: async ({ pageParam = 1 }) => {
      const url =
        `/accounts/${accountId}/transactions?page=${pageParam}&limit=10` +
        (txType ? `&txType=${txType}` : "");
      const res = await api.get(url);
      return res.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
  });
};
