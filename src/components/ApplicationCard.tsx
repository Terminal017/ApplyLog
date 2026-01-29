import { useState, useEffect, useCallback, type ReactElement } from 'react'
import { Calendar } from 'lucide-react'
import type { Application } from '../lib/types'
import {
  cn,
  formatShortDate,
  getResultStatusColor,
  getJobTypeColor,
} from '../lib/utils'

interface ApplicationCardProps {
  application: Application
  onEdit: (application: Application) => void
  onDelete: (id: string) => void
}

interface ContextMenuPosition {
  x: number
  y: number
}

export default function ApplicationCard({
  application,
  onEdit,
  onDelete,
}: ApplicationCardProps): ReactElement {
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(
    null,
  )

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // 计算菜单位置，确保不超出视口
    const x = Math.min(e.clientX, window.innerWidth - 120)
    const y = Math.min(e.clientY, window.innerHeight - 50)

    setContextMenu({ x, y })
  }

  // 关闭右键菜单
  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  // 处理删除点击
  const handleDeleteClick = () => {
    closeContextMenu()
    onDelete(application.id)
  }

  // 处理卡片点击（编辑）
  const handleCardClick = (e: React.MouseEvent) => {
    // 如果点击的是链接，不触发编辑
    if ((e.target as HTMLElement).closest('a')) {
      return
    }
    onEdit(application)
  }

  // 点击其他区域或按 ESC 关闭菜单
  useEffect(() => {
    if (!contextMenu) return

    const handleClick = () => closeContextMenu()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContextMenu()
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [contextMenu, closeContextMenu])

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleCardClick}
        onContextMenu={handleContextMenu}
      >
        {/* 第一行：公司名称 + 岗位名称 + 结果标签 */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* 公司名称 - 蓝色，可点击跳转 */}
            {application.applyLink ? (
              <a
                href={application.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold text-blue-600 hover:text-blue-800 truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {application.companyName}
              </a>
            ) : (
              <span className="text-lg font-bold text-blue-600 truncate">
                {application.companyName}
              </span>
            )}
            {/* 岗位名称 */}
            <span className="text-sm text-gray-500 truncate">
              {application.jobName}
            </span>
          </div>

          {/* 结果标签 */}
          <span
            className={cn(
              'px-3 py-1 text-sm font-medium rounded-lg shrink-0',
              getResultStatusColor(application.result),
            )}
          >
            {application.result}
          </span>
        </div>

        {/* 第二行：岗位类型 + 城市·投递渠道 */}
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100">
          <span
            className={cn(
              'px-2 py-0.5 text-xs rounded',
              getJobTypeColor(application.jobType || '日常实习'),
            )}
          >
            {application.jobType || '日常实习'}
          </span>
          <span className="px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded">
            {application.city} · {application.applyChannel}投递
          </span>
        </div>

        {/* 第三行：当前进度 */}
        <div className="text-sm text-gray-900 font-medium mb-1 text-left">
          当前进度：{application.processStatus}
        </div>

        {/* 第四行：记录 */}
        <div className="text-sm text-gray-500 mb-3 text-left">
          记录：{application.record || '无'}
        </div>

        {/* 最后一行：投递时间 + 分类 */}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1 text-gray-700">
            <Calendar size={14} />
            <span>投递时间：{formatShortDate(application.applyDate)}</span>
          </div>
          <span className="text-gray-700">{application.companyLevel}</span>
        </div>
      </div>

      {/* 右键菜单 */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={handleDeleteClick}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            删除
          </button>
        </div>
      )}
    </>
  )
}
