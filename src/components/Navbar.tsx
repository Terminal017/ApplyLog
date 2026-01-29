import { useState } from 'react'
import type { ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'

export default function Navbar(): ReactElement {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-blue-600">应聘信息记录</h1>

        {/* 桌面端导航 */}
        <nav className="hidden sm:flex items-center space-x-6">
          <Link
            to="/"
            className={clsx(
              'text-sm font-medium transition-colors',
              isActive('/')
                ? 'text-blue-600'
                : 'text-gray-700 hover:text-blue-600',
            )}
          >
            投递记录
          </Link>
          <Link
            to="/calendar"
            className={clsx(
              'text-sm font-medium transition-colors',
              isActive('/calendar')
                ? 'text-blue-600'
                : 'text-gray-700 hover:text-blue-600',
            )}
          >
            日程表
          </Link>
        </nav>

        {/* 移动端菜单按钮 */}
        <button
          onClick={toggleMobileMenu}
          className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="菜单"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 移动端导航菜单 */}
      {isMobileMenuOpen && (
        <nav className="sm:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={clsx(
                'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive('/')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50',
              )}
            >
              投递记录
            </Link>
            <Link
              to="/calendar"
              onClick={closeMobileMenu}
              className={clsx(
                'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive('/calendar')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50',
              )}
            >
              日程表
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
