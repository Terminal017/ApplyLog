// filepath: /Users/raven/code/Apply_Record/ApplyLog/src/pages/SchedulePage.tsx
import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { useScheduleStore } from '../store/scheduleStore'
import ScheduleFilterBar from '../components/ScheduleFilterBar'
import ScheduleRow from '../components/ScheduleRow'
import ScheduleForm from '../components/ScheduleForm'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import type { Schedule, ScheduleInput } from '../lib/types'

export default function SchedulePage(): ReactElement {
  const {
    isLoading,
    fetchSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleComplete,
    getPaginatedSchedules,
    getTotalPages,
    getStats,
    currentPage,
    setCurrentPage,
  } = useScheduleStore()

  // 弹窗状态
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 删除确认弹窗状态
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  const paginatedSchedules = getPaginatedSchedules()
  const totalPages = getTotalPages()
  const stats = getStats()

  // 打开新增弹窗
  const handleAddClick = () => {
    setEditingSchedule(null)
    setIsFormOpen(true)
  }

  // 打开编辑弹窗
  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setIsFormOpen(true)
  }

  // 关闭弹窗
  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingSchedule(null)
  }

  // 提交表单
  const handleSubmit = async (data: ScheduleInput) => {
    setIsSubmitting(true)
    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, data)
      } else {
        await addSchedule(data)
      }
      handleCloseForm()
    } finally {
      setIsSubmitting(false)
    }
  }

  // 删除日程
  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteSchedule(deleteId)
      setDeleteId(null)
    }
  }

  // 切换完成状态
  const handleToggleComplete = async (id: string) => {
    await toggleComplete(id)
  }

  // 分页处理
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div>
      {/* 筛选栏 */}
      <ScheduleFilterBar onAddClick={handleAddClick} />

      {/* 日程列表 */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : paginatedSchedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg shadow">
          <p className="text-gray-500 text-xl">暂无日程</p>
          <p className="text-gray-400 mt-2">点击「新增日程」按钮开始添加</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 w-54">
                  日期
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 w-48">
                  时间
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                  日程内容
                </th>
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-600 w-16">
                  状态
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedSchedules.map((schedule) => (
                <ScheduleRow
                  key={schedule.id}
                  schedule={schedule}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </tbody>
          </table>

          {/* 分页 */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              共 {stats.total} 个日程，{stats.completed} 个已完成
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span className="px-3 py-1 text-sm">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`mx-1 px-2 py-1 rounded ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增/编辑弹窗 */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingSchedule ? '编辑日程' : '新增日程'}
      >
        <ScheduleForm
          initialData={editingSchedule ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* 删除确认弹窗 */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="确认删除"
        message="确定要删除这个日程吗？此操作无法撤销。"
      />
    </div>
  )
}
