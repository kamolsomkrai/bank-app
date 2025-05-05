'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

export default function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className="w-full bg-blue-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center space-x-4">
          {session && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          )}
          <Link href="/" className="text-2xl font-bold">
            🏦 Bank System
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.png" alt="User" />
                  <AvatarFallback>
                    {session.user?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white text-black">
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 transition"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>

      {session && open && (
        <div className="md:hidden bg-blue-700 px-4 py-2 space-y-2">
          <Link href="/dashboard" className="block py-2 hover:text-gray-200">
            Dashboard
          </Link>
          <Link href="/customers" className="block py-2 hover:text-gray-200">
            Customers
          </Link>
          <Link href="/accounts" className="block py-2 hover:text-gray-200">
            Accounts
          </Link>
        </div>
      )}
    </nav>
  )
}