"use client";

import { useState } from "react";
import AuthGuard from "@/middlewares/authGuard";
import { useMonthlyStatement } from "@/hooks/useMonthlyStatement";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function StatementPage() {
  const [accountId, setAccountId] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState(false);

  const { data, isLoading } = useMonthlyStatement(accountId, month, year, search);

  const handleSearch = () => {
    if (accountId.length === 0) return;
    setSearch(true);
  };

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Statement รายเดือน</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="text"
            placeholder="Account ID"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          />
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="border p-2 rounded"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="ปี (เช่น 2025)"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          />
          <Button onClick={handleSearch}>ค้นหา</Button>
        </div>

        {isLoading ? (
          <div>กำลังโหลดข้อมูล...</div>
        ) : data && data.length > 0 ? (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full table-auto border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">วันที่</th>
                  <th className="p-2 border">ประเภท</th>
                  <th className="p-2 border">จำนวนเงิน</th>
                  <th className="p-2 border">ยอดคงเหลือหลังทำรายการ</th>
                  <th className="p-2 border">รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                {data.map((tx: any) => (
                  <tr key={tx.id} className="text-center">
                    <td className="p-2 border">{new Date(tx.txDate).toLocaleString()}</td>
                    <td className="p-2 border">{tx.txType}</td>
                    <td className="p-2 border">{tx.amount.toLocaleString()} บาท</td>
                    <td className="p-2 border">{tx.balanceAfter.toLocaleString()} บาท</td>
                    <td className="p-2 border">{tx.description || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          search && <div className="text-center text-gray-500 mt-6">ไม่พบข้อมูลในเดือนที่เลือก</div>
        )}
      </div>
    </AuthGuard>
  );
}
