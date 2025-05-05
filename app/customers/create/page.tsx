// app/customers/create/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import api from '@/libs/api'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function CreateCustomerPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    prefix: '',
    firstName: '',
    lastName: '',
    cid: '',
    birthDate: '',
    gender: 'M',
    address: '',
    province: '',
    district: '',
    subDistrict: '',
    moo: '',
    phone: '',
    email: '',
    occupation: '',
    initialDeposit: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const onChange = (field: keyof typeof form, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}
    const requiredFields = [
      'prefix', 'firstName', 'lastName', 'cid', 'birthDate',
      'gender', 'address', 'province', 'district', 'subDistrict',
      'moo', 'phone', 'initialDeposit'
    ]

    requiredFields.forEach(field => {
      if (!form[field as keyof typeof form]) {
        newErrors[field] = 'กรุณากรอกข้อมูล'
      }
    })

    if (form.cid.length !== 13) {
      newErrors.cid = 'รหัสประชาชนต้อง 13 หลัก'
    }

    if (form.phone.length !== 10) {
      newErrors.phone = 'เบอร์โทรต้อง 10 หลัก'
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const payload = {
        prefix: form.prefix,
        first_name: form.firstName,
        last_name: form.lastName,
        cid: form.cid,
        birthDate: form.birthDate,
        gender: form.gender,
        address: form.address,
        province: form.province,
        district: form.district,
        subDistrict: form.subDistrict,
        moo: form.moo,
        phone: form.phone,
        email: form.email || null,
        occupation: form.occupation || null,
        initialDeposit: parseFloat(form.initialDeposit),
      }
      const response = await fetch('http://202.148.187.2:8000/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'สร้างลูกค้าไม่สำเร็จ');
      }

      const res = await response.json();
      toast.success('สร้างลูกค้าเรียบร้อย')
      router.push(`/accounts/add?customerId=${res.id}`)
    } catch (err: any) {
      toast.error(err.message || 'สร้างลูกค้าไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">สร้างลูกค้าใหม่</h1>
        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">รหัสประชาชน <span className="text-red-500">*</span></label>
              <Input
                value={form.cid}
                onChange={e => onChange('cid', e.target.value)}
                placeholder="13 หลัก"
                maxLength={13}
              />
              {errors.cid && <p className="text-red-500 text-xs">{errors.cid}</p>}
            </div>
          </div>

          {/* ชื่อ / นามสกุล */}
          <div className="grid md:grid-cols-5 gap-4">
            {/* คำนำหน้า */}
            <div>
              <label className="block mb-1">คำนำหน้า <span className="text-red-500">*</span></label>
              <Input
                value={form.prefix}
                onChange={e => onChange('prefix', e.target.value)}
                placeholder="นาย, นาง, นส"
              />
              {errors.prefix && <p className="text-red-500 text-xs">{errors.prefix}</p>}
            </div>
            <div className='col-span-2'>
              <label className="block mb-1">ชื่อ <span className="text-red-500">*</span></label>
              <Input
                value={form.firstName}
                onChange={e => onChange('firstName', e.target.value)}
                placeholder="ชื่อ"
              />
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
            </div>
            <div className='col-span-2'>
              <label className="block mb-1">นามสกุล <span className="text-red-500">*</span></label>
              <Input
                value={form.lastName}
                onChange={e => onChange('lastName', e.target.value)}
                placeholder="นามสกุล"
              />
              {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
            </div>
          </div>

          {/* รหัสประชาชน / วันเกิด */}


          {/* เพศ / เบอร์โทร */}
          <div className="grid md:grid-cols-5 gap-4">
            <div className='col-span-1'>
              <label className="block mb-1">เพศ <span className="text-red-500">*</span></label>
              <select
                value={form.gender}
                onChange={e => onChange('gender', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="M">ชาย</option>
                <option value="F">หญิง</option>
              </select>
            </div>
            <div className='col-span-2'>
              <label className="block mb-1">วันเกิด <span className="text-red-500">*</span></label>
              <Input
                type="date"
                value={form.birthDate}
                onChange={e => onChange('birthDate', e.target.value)}
                className='w-full p-2 border rounded'
              />
              {errors.birthDate && <p className="text-red-500 text-xs">{errors.birthDate}</p>}
            </div>
            <div className='col-span-2'>
              <label className="block mb-1">เบอร์โทร <span className="text-red-500">*</span></label>
              <Input
                value={form.phone}
                onChange={e => onChange('phone', e.target.value)}
                placeholder="0812345678"
                maxLength={10}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>
          </div>

          {/* ที่อยู่ */}
          <div className="grid md:grid-cols-5 gap-4">
            <div className='col-span-2'>
              <label className="block mb-1">ที่อยู่ <span className="text-red-500">*</span></label>
              <Input
                value={form.address}
                onChange={e => onChange('address', e.target.value)}
                placeholder="ที่อยู่"
              />
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
            </div>
            {/* หมู่ที่ */}
            <div className='col-span-1'>
              <label className="block mb-1">หมู่ที่ <span className="text-red-500">*</span></label>
              <Input
                value={form.moo}
                onChange={e => onChange('moo', e.target.value)}
                placeholder="หมู่ที่"
              />
              {errors.moo && <p className="text-red-500 text-xs">{errors.moo}</p>}
            </div>
          </div>

          {/* จังหวัด/อำเภอ/ตำบล */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">ตำบล/แขวง <span className="text-red-500">*</span></label>
              <Input
                value={form.subDistrict}
                onChange={e => onChange('subDistrict', e.target.value)}
                placeholder="ตำบล/แขวง"
              />
              {errors.subDistrict && <p className="text-red-500 text-xs">{errors.subDistrict}</p>}
            </div>
            <div>
              <label className="block mb-1">อำเภอ/เขต <span className="text-red-500">*</span></label>
              <Input
                value={form.district}
                onChange={e => onChange('district', e.target.value)}
                placeholder="อำเภอ/เขต"
              />
              {errors.district && <p className="text-red-500 text-xs">{errors.district}</p>}
            </div>
            <div>
              <label className="block mb-1">จังหวัด <span className="text-red-500">*</span></label>
              <Input
                value={form.province}
                onChange={e => onChange('province', e.target.value)}
                placeholder="จังหวัด"
              />
              {errors.province && <p className="text-red-500 text-xs">{errors.province}</p>}
            </div>


          </div>



          {/* Email/อาชีพ */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">อีเมล (ถ้ามี)</label>
              <Input
                type="email"
                value={form.email}
                onChange={e => onChange('email', e.target.value)}
                placeholder="อีเมล"
              />
            </div>
            <div>
              <label className="block mb-1">อาชีพ (ถ้ามี)</label>
              <Input
                value={form.occupation}
                onChange={e => onChange('occupation', e.target.value)}
                placeholder="อาชีพ"
              />
            </div>
          </div>

          {/* เงินฝากเริ่มต้น */}
          <div>
            <label className="block mb-1">เงินฝากเริ่มต้น <span className="text-red-500">*</span></label>
            <Input
              type="number"
              value={form.initialDeposit}
              onChange={e => onChange('initialDeposit', e.target.value)}
              placeholder="จำนวนเงิน"
            />
            {errors.initialDeposit && <p className="text-red-500 text-xs">{errors.initialDeposit}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'กำลังบันทึก...' : 'สร้างลูกค้า'}
          </Button>
        </form>
      </div>
    </ProtectedRoute>
  )
}