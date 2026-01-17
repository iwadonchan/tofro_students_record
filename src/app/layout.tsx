import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { GraduationCap, LayoutDashboard, Users, ArrowUpCircle } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HS-SIMS',
  description: 'High School Student Information Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-slate-50 min-h-screen flex`}>
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-slate-100 flex-shrink-0 hidden md:flex flex-col">
          <div className="p-6 flex items-center gap-3 font-bold text-xl border-b border-slate-800">
            <GraduationCap className="w-8 h-8 text-blue-400" />
            <span>HS-SIMS</span>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
              <Users className="w-5 h-5" />
              <span>Students</span>
            </Link>
            <Link href="/promotion" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
              <ArrowUpCircle className="w-5 h-5" />
              <span>Promotion</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">T</div>
              <div>
                <p className="text-sm font-medium">Teacher</p>
                <p className="text-xs text-slate-400">Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
            <h1 className="text-lg font-semibold text-slate-800">Student Information System</h1>
            <div className="text-sm text-slate-500">Academic Year: 2025</div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
