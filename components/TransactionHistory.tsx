"use client";

import { useState, useEffect, useRef } from "react";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { generateTransactionPDF } from "@/libs/pdf";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export default function TransactionHistory({ accountId }: { accountId: string }) {
  const [filter, setFilter] = useState<string>("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactionHistory(accountId, filter);

  const observer = useRef<IntersectionObserver>();

  const lastTransactionRef = (node: HTMLDivElement) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  };

  const handleExportExcel = () => {
    const allTransactions = data?.pages.flatMap((page) => page.data) || [];
    if (allTransactions.length === 0) {
      toast.error("ไม่มีข้อมูลให้ export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(allTransactions.map((tx: any) => ({
      ID: tx.id,
      ประเภท: tx.txType,
      จำนวนเงิน: tx.amount,
      วันที่: new Date(tx.txDate).toLocaleString()
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");

    toast.success("Export Excel สำเร็จ");
  };

  const handleExportPDF = () => {
    const allTransactions = data?.pages.flatMap((page) => page.data) || [];
    if (allTransactions.length === 0) {
      toast.error("ไม่มีข้อมูลให้ export");
      return;
    }

    generateTransactionPDF(allTransactions);
    toast.success("Export PDF สำเร็จ");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">ทั้งหมด</option>
          <option value="DEPOSIT">ฝากเงิน</option>
          <option value="WITHDRAW">ถอนเงิน</option>
          <option value="TRANSFER">โอนเงิน</option>
        </select>

        <div className="flex space-x-2">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Export Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Export PDF
          </button>
        </div>
      </div>

      {data?.pages.map((page, pageIndex) => (
        page.data.map((transaction: any, txIndex: number) => {
          const isLast = pageIndex === data.pages.length - 1 && txIndex === page.data.length - 1;
          return (
            <div
              key={transaction.id}
              ref={isLast ? lastTransactionRef : null}
              className="p-4 border rounded shadow-sm"
            >
              <p><strong>{transaction.txType}</strong> - {transaction.amount} บาท</p>
              <p className="text-gray-500">{new Date(transaction.txDate).toLocaleString()}</p>
            </div>
          );
        })
      ))}

      {isFetchingNextPage && <p className="text-center">กำลังโหลด...</p>}
    </div>
  );
}
