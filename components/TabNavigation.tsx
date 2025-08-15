'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaLeaf, FaBook, FaUsers } from 'react-icons/fa'

const tabs = [
  { href: '/', label: '使う', icon: FaLeaf },
  { href: '/records', label: '記録', icon: FaBook },
  { href: '/teams', label: 'つながる', icon: FaUsers },
]

export default function TabNavigation() {
  const pathname = usePathname()

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
      <div className="grid grid-cols-3 h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-2 transition-colors ${
                isActive
                  ? 'text-[var(--primary)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="text-xl mb-1" />
              <span className="text-xs">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}