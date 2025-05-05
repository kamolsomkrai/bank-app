"use client";
import { useState, FormEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  cid: string;
}

interface Account {
  id: string;
  accountNumber: string;
  accountType: "SAVINGS" | "CURRENT";
  balance: string;
  status: string;
  openedAt: string;
}

export default function AddAccountPage() {
  const [keyword, setKeyword] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountType, setAccountType] = useState<"SAVINGS" | "CURRENT">("SAVINGS");
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  // Search customer
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsSearching(true);
    setError("");

    try {
      // Search customer
      const customerRes = await fetch("http://localhost:8000/customers/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ keyword })
      });

      if (!customerRes.ok) throw new Error("Customer not found");

      const customerData = await customerRes.json();
      setCustomer(customerData);

      // Get accounts
      const accountsRes = await fetch(`http://localhost:8000/customers/${customerData.id}/accounts`);
      if (!accountsRes.ok) throw new Error("Failed to load accounts");

      const accountsData = await accountsRes.json();
      setAccounts(accountsData);
    } catch (err) {
      setError(err.message);
      setCustomer(null);
      setAccounts([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Add new account
  const handleAddAccount = async () => {
    if (!customer) return;

    setIsAdding(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/accounts/open", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer_id: customer.id,
          account_type: accountType,
          initial_deposit: 500 // Assuming no initial deposit for simplicity
        })
      });

      if (!res.ok) throw new Error("Failed to open account");

      const newAccount = await res.json();

      // Refresh accounts list
      const accountsRes = await fetch(`http://localhost:8000/customers/${customer.id}/accounts`);
      const accountsData = await accountsRes.json();
      setAccounts(accountsData);

      alert(`Successfully opened account: ${newAccount.accountNumber}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">เปิดบัญชีใหม่</h1>

      {/* Search Section */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ค้นหาด้วย CID, ชื่อ, หรือเบอร์โทร"
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? "กำลังค้นหา..." : "ค้นหา"}
          </Button>
        </div>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Customer Info */}
      {customer && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">ข้อมูลลูกค้า</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">ชื่อ-นามสกุล</p>
              <p className="font-medium">{customer.firstName} {customer.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">เลขประจำตัวประชาชน</p>
              <p className="font-mono">
                {customer.cid.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Existing Accounts */}
      {accounts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">บัญชีที่มีอยู่</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">เลขบัญชี</th>
                  <th className="px-4 py-3 text-left">ประเภท</th>
                  <th className="px-4 py-3 text-left">ยอดเงิน</th>
                  <th className="px-4 py-3 text-left">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono">{acc.accountNumber}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        {acc.accountType === "SAVINGS" ? "ออมทรัพย์" : "กระแสรายวัน"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {Number(acc.balance).toLocaleString("th-TH", {
                        style: "currency",
                        currency: "THB",
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-sm rounded-full ${acc.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}>
                        {acc.status === "ACTIVE" ? "เปิดใช้งาน" : "ปิดการใช้งาน"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Account Form */}
      {customer && (
        <div className="p-6 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">เปิดบัญชีใหม่</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-medium">ประเภทบัญชี</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as any)}
                className="w-full p-2 border rounded-md bg-white"
              >
                <option value="SAVINGS">บัญชีออมทรัพย์</option>
                <option value="CURRENT">บัญชีกระแสรายวัน</option>
              </select>
            </div>
            <Button
              onClick={handleAddAccount}
              disabled={isAdding}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isAdding ? "กำลังดำเนินการ..." : "เปิดบัญชี"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}