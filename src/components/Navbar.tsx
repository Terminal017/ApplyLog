import type { ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import clsx from 'clsx'

interface NavbarProps {
  onAddClick: () => void
}

export default function Navbar({ onAddClick }: NavbarProps): ReactElement {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-blue-600">应聘信息追踪</h1>

        <nav className="flex items-center space-x-6">
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

          <button
            onClick={onAddClick}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            新增投递
          </button>
        </nav>
      </div>
    </header>
  )
}
