import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

export default function CalendarPage(): ReactElement {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">日程表</h2>
      <p className="text-gray-500">日程表功能开发中。</p>
      <p className="mt-4">
        <Link to="/" className="text-blue-600">
          返回投递记录
        </Link>
      </p>
    </div>
  )
}
