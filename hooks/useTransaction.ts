// src/hooks/useTransaction.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";

type TransactionInput = {
  account_id: string;
  customer_id: string;
  tx_type: "DEPOSIT" | "WITHDRAW";
  amount: number;
};

export const useTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TransactionInput) => {
      const res = await api.post("/accounts/transaction", input);
      return res.data;
    },
    onMutate: async (input) => {
      // Cancel queries ที่เกี่ยวข้องก่อน
      await queryClient.cancelQueries(["account", input.account_id]);

      // ดึงข้อมูลปัจจุบัน
      const previousData = queryClient.getQueryData([
        "account",
        input.account_id,
      ]);

      // Optimistically Update
      queryClient.setQueryData(["account", input.account_id], (old: any) => {
        if (!old) return old;
        const newBalance =
          input.tx_type === "DEPOSIT"
            ? old.balance + input.amount
            : old.balance - input.amount;
        return { ...old, balance: newBalance };
      });

      return { previousData };
    },
    onError: (err, input, context) => {
      // ถ้า error → rollback กลับค่าก่อนหน้า
      if (context?.previousData) {
        queryClient.setQueryData(
          ["account", input.account_id],
          context.previousData
        );
      }
    },
    onSettled: (data, error, input) => {
      // Re-fetch ยอดจาก server
      queryClient.invalidateQueries(["account", input.account_id]);
    },
  });
};
