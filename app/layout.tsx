// app/layout.tsx หรือ app/(dashboard)/layout.tsx
'use client'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import SplashScreen from '@/components/SplashScreen'
import QueryProvider from '@/providers/QueryProvider'
import ToasterProvider from '@/providers/ToasterProvider'
import ProtectedRoute from '@/components/ProtectedRoute'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEffect } from 'react'
NProgress.configure({ showSpinner: false })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  useEffect(() => { NProgress.start(); setTimeout(() => NProgress.done(), 500) }, [pathname])
  const publicRoutes = ['/', '/login', '/register', '/forgot-password']
  const isPublic = publicRoutes.includes(pathname)

  return (
    <html lang="th">
      <body className="bg-gray-100 dark:bg-gray-950">
        <SessionProvider>
          <SplashScreen />
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <QueryProvider>
              <ToasterProvider />
              <main className="flex-1 p-4">
                {isPublic ? children : <ProtectedRoute>{children}</ProtectedRoute>}
              </main>
            </QueryProvider>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
