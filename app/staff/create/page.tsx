'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import api from '@/libs/api'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function CreateStaffPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', firstName: '', lastName: '', role: 'TELLER', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const onChange = (field: keyof typeof form, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err: Record<string, string> = {}
      ;['username', 'firstName', 'lastName', 'password'].forEach(k => {
        if (!form[k as keyof typeof form]) err[k] = 'กรุณากรอกข้อมูล'
      })
    if (Object.keys(err).length) return setErrors(err)

    setLoading(true)
    try {
      const payload = {
        username: form.username,
        first_name: form.firstName,
        last_name: form.lastName,
        role: form.role,
        password: form.password,
      }
      await api.post('/staff', payload)
      toast.success('สร้างพนักงานเรียบร้อย')
      router.push('/staff')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'สร้างพนักงานไม่สำเร็จ')
    } finally { setLoading(false) }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">สร้างพนักงานใหม่</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1">Username</label>
            <Input
              value={form.username}
              onChange={e => onChange('username', e.target.value)}
              placeholder="Username"
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <Input
              type="password"
              value={form.password}
              onChange={e => onChange('password', e.target.value)}
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">First Name</label>
              <Input
                value={form.firstName}
                onChange={e => onChange('firstName', e.target.value)}
                placeholder="First Name"
              />
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block mb-1">Last Name</label>
              <Input
                value={form.lastName}
                onChange={e => onChange('lastName', e.target.value)}
                placeholder="Last Name"
              />
              {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
            </div>
          </div>
          <div>
            <label className="block mb-1">Role</label>
            <select
              value={form.role}
              onChange={e => onChange('role', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="TELLER">TELLER</option>
              <option value="LOAN_OFFICER">LOAN_OFFICER</option>
              <option value="MANAGER">MANAGER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'กำลังบันทึก...' : 'สร้างพนักงาน'}
          </Button>
        </form>
      </div>
    </ProtectedRoute>
  )
}