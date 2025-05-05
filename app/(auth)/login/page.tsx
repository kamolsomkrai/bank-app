'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn('credentials', {
      redirect: false,
      username: formData.username,
      password: formData.password,
      callbackUrl: '/dashboard'
    })

    setLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else if (result?.ok) {
      toast.success('เข้าสู่ระบบสำเร็จ')
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Bank System Login</h1>
      <Input
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <Input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="mt-4"
      />
      <Button type="submit" className="mt-6 w-full" disabled={loading}>
        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-950">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}