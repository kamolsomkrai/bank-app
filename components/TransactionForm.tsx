"use client";

import { useState } from "react";
import { useTransaction } from "@/hooks/useTransaction";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function TransactionForm({ accountId, customerId }: { accountId: string, customerId: string }) {
  const [amount, setAmount] = useState(0);
  const [txType, setTxType] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");

  const { mutate, isPending } = useTransaction();

  const handleSubmit = () => {
    mutate({
      account_id: accountId,
      customer_id: customerId,
      tx_type: txType,
      amount,
    });
  };

  return (
    <div className="space-y-4">
      <select
        value={txType}
        onChange={(e) => setTxType(e.target.value as "DEPOSIT" | "WITHDRAW")}
        className="border p-2 w-full rounded"
      >
        <option value="DEPOSIT">ฝากเงิน</option>
        <option value="WITHDRAW">ถอนเงิน</option>
      </select>

      <Input
        type="number"
        placeholder="จำนวนเงิน"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
      />

      <Button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "กำลังทำรายการ..." : "ยืนยันทำรายการ"}
      </Button>
    </div>
  );
}
