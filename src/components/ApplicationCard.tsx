import { useState, useEffect, useCallback, type ReactElement } from 'react'
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'
import type { Application } from '../lib/types'
import { format } from 'date-fns'

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
  const [isExpanded, setIsExpanded] = useState(false)
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(
    null,
  )

  // 获取结果显示样式
  const getResultStyle = (result: Application['result']) => {
    if (result === null) {
      return 'bg-blue-100 text-blue-700'
    }
    if (result === 'offer') {
      return 'bg-green-100 text-green-700'
    }
    return 'bg-red-100 text-red-700'
  }

  // 获取结果显示文本
  const getResultText = (result: Application['result']) => {
    if (result === null) {
      return '流程中'
    }
    return result
  }

  // 格式化日期
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'yyyy-MM-dd')
    } catch {
      return dateStr
    }
  }

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
    // 如果点击的是展开按钮，不触发编辑
    if ((e.target as HTMLElement).closest('[data-expand-btn]')) {
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
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleCardClick}
        onContextMenu={handleContextMenu}
      >
        {/* 头部：公司名称 + 结果标签 */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            {/* 公司名称 - 可点击跳转 */}
            {application.applyLink ? (
              <a
                href={application.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {application.companyName}
                <ExternalLink size={14} />
              </a>
            ) : (
              <h3 className="text-lg font-semibold text-gray-900">
                {application.companyName}
              </h3>
            )}
            {/* 岗位名称 */}
            <p className="text-sm text-gray-600 mt-0.5">
              {application.jobName}
            </p>
          </div>

          {/* 结果标签 */}
          <span
            className={clsx(
              'px-2 py-1 text-xs font-medium rounded-full',
              getResultStyle(application.result),
            )}
          >
            {getResultText(application.result)}
          </span>
        </div>

        {/* 信息行 */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
          <span>{application.city}</span>
          <span>{application.companyLevel}</span>
          <span>{application.applyChannel}</span>
        </div>

        {/* 投递时间和当前流程 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-2">
          <span className="text-gray-500">
            投递时间：{formatDate(application.applyDate)}
          </span>
          <span className="text-gray-700">
            当前流程：
            <span className="font-medium">{application.processStatus}</span>
          </span>
        </div>

        {/* 展开/折叠按钮 */}
        {(application.record || application.remark) && (
          <button
            data-expand-btn
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={16} />
                收起详情
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                展开详情
              </>
            )}
          </button>
        )}

        {/* 折叠内容：信息记录和备注 */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            {application.record && (
              <div>
                <span className="text-sm font-medium text-gray-700">
                  信息记录：
                </span>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {application.record}
                </p>
              </div>
            )}
            {application.remark && (
              <div>
                <span className="text-sm font-medium text-gray-700">
                  备注：
                </span>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {application.remark}
                </p>
              </div>
            )}
          </div>
        )}
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
