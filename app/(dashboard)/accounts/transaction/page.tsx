"use client"

import { useState, FormEvent, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Account {
  id: string
  accountNumber: string
  accountType: "SAVINGS" | "CURRENT"
  balance: string
  status: string
}

interface Transaction {
  id: string
  txDate: string
  txType: "DEPOSIT" | "WITHDRAW" | "TRANSFER"
  amount: string
  balanceAfter: string
  description?: string
}

const formatAccountNumber = (num: string) => {
  const cleaned = num.replace(/\D/g, '')
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 9)}-${cleaned.slice(9, 13)}`
}

const formatCurrency = (value: string | number) => {
  return Number(value).toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2
  })
}

export default function TransactionPage() {
  const [displayAccount, setDisplayAccount] = useState("")
  const [account, setAccount] = useState<Account | null>(null)
  const [type, setType] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT")
  const [amount, setAmount] = useState("")
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  })
  const [statement, setStatement] = useState<Transaction[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingStmt, setIsLoadingStmt] = useState(false)

  useEffect(() => {
    const fetchStatement = async () => {
      if (!displayAccount || !month) return

      setIsLoadingStmt(true)
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `http://172.18.1.41:8000/accounts/${displayAccount}/statement?month=${month}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) throw new Error('ไม่สามารถโหลดรายการเดินบัญชี')

        const data: Transaction[] = await response.json()
        setStatement(data)
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : 'โหลดข้อมูลล้มเหลว')
        setStatement([])
      } finally {
        setIsLoadingStmt(false)
      }
    }

    fetchStatement()
  }, [displayAccount, month])

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    if (!displayAccount) {
      toast.error("กรุณากรอกเลขบัญชี")
      return
    }

    setIsSearching(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://172.18.1.41:8000/accounts/${displayAccount}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'ไม่พบเลขบัญชีนี้')
      }

      const data: Account = await response.json()
      setAccount(data)
    } catch (error: unknown) {
      setAccount(null)
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsSearching(false)
    }
  }

  const handleTransaction = async (e: FormEvent) => {
    e.preventDefault()
    if (!account || !amount || isNaN(parseFloat(amount))) {
      toast.error("กรุณากรอกจำนวนเงินให้ถูกต้อง")
      return
    }

    setIsProcessing(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://172.18.1.41:8000/accounts/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          account_number: displayAccount,
          tx_type: type,
          amount: parseFloat(amount),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'ทำรายการไม่สำเร็จ')
      }

      const data = await response.json()
      toast.success(`ทำรายการสำเร็จ ยอดคงเหลือ: ${formatCurrency(data.new_balance)}`)
      setAccount(prev => prev ? { ...prev, balance: data.new_balance } : null)
      setAmount("")

      // โหลด statement ใหม่
      const stmtResponse = await fetch(
        `http://172.18.1.41:8000/accounts/${displayAccount}/statement?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (stmtResponse.ok) {
        const stmtData = await stmtResponse.json()
        setStatement(stmtData)
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-6">
        {/* ค้นหาบัญชี */}
        <section>
          <h1 className="text-2xl font-bold mb-4">ฝาก/ถอนเงิน</h1>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              placeholder="เลขที่บัญชี"
              value={displayAccount}
              onChange={e => setDisplayAccount(formatAccountNumber(e.target.value))}
              inputMode="numeric"
              maxLength={15}
              className="flex-1"
            />
            <Button type="submit" disabled={isSearching}>
              {isSearching ? "ค้นหา..." : "ค้นหา"}
            </Button>
          </form>

          {account && (
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-2">
              <p><strong>เลขบัญชี:</strong> {account.accountNumber}</p>
              <p><strong>ประเภทบัญชี:</strong> {account.accountType === "SAVINGS" ? "ออมทรัพย์" : "กระแสรายวัน"}</p>
              <p><strong>ยอดคงเหลือ:</strong> {formatCurrency(account.balance)}</p>
              <p><strong>สถานะ:</strong> {account.status === "ACTIVE" ? "เปิดใช้งาน" : "ปิดใช้งาน"}</p>
            </div>
          )}
        </section>

        {/* ทำรายการ */}
        {account && (
          <section>
            <h2 className="text-xl font-semibold mb-4">ทำรายการ</h2>
            <form onSubmit={handleTransaction} className="flex gap-4 flex-wrap items-center">
              <select
                value={type}
                onChange={e => setType(e.target.value as typeof type)}
                className="p-2 border rounded"
                disabled={isProcessing}
              >
                <option value="DEPOSIT">ฝากเงิน</option>
                <option value="WITHDRAW">ถอนเงิน</option>
              </select>

              <Input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="จำนวนเงิน"
                className="w-32"
                min="0"
                step="0.01"
              />

              <Button type="submit" disabled={isProcessing || !amount}>
                {isProcessing ? "กำลังทำรายการ..." : "ยืนยัน"}
              </Button>
            </form>
          </section>
        )}

        {/* รายการเดินบัญชี */}
        {account && (
          <section>
            <h2 className="text-xl font-semibold mb-4">รายการเคลื่อนไหว</h2>
            <Input
              type="month"
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="max-w-[200px] mb-2"
            />
            {isLoadingStmt ? (
              <p className="text-center text-gray-500">กำลังโหลดรายการ...</p>
            ) : statement.length > 0 ? (
              <div className="overflow-x-auto border rounded">
                <table className="w-full">
                  <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                      <th className="p-2 text-left">วันที่</th>
                      <th className="p-2 text-left">ประเภท</th>
                      <th className="p-2 text-left">จำนวนเงิน</th>
                      <th className="p-2 text-left">ยอดคงเหลือ</th>
                      <th className="p-2 text-left">รายละเอียด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statement.map(tx => (
                      <tr key={tx.id} className="border-t">
                        <td className="p-2">{new Date(tx.txDate).toLocaleDateString("th-TH")}</td>
                        <td className="p-2">
                          {tx.txType === "DEPOSIT" ? "ฝาก" :
                            tx.txType === "WITHDRAW" ? "ถอน" : "โอน"}
                        </td>
                        <td className="p-2">{formatCurrency(tx.amount)}</td>
                        <td className="p-2">{formatCurrency(tx.balanceAfter)}</td>
                        <td className="p-2">{tx.description || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">ไม่มีรายการในเดือนนี้</p>
            )}
          </section>
        )}
      </div>
    </ProtectedRoute>
  )
}
