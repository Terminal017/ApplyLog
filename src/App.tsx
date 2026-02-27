import './App.css'
import { useState, useCallback, type ReactElement } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ApplicationsPage from './pages/ApplicationsPage'
import SchedulePage from './pages/SchedulePage'
import Navbar from './components/Navbar'
import Modal from './components/Modal'
import ConfirmDialog from './components/ConfirmDialog'
import ApplicationForm from './components/ApplicationForm'
import Toast, { type ToastType } from './components/Toast'
import { useApplicationStore } from './store/applicationStore'
import type { Application, ApplicationInput } from './lib/types'

interface ToastState {
  isVisible: boolean
  message: string
  type: ToastType
}

function App(): ReactElement {
  const { addApplication, updateApplication, deleteApplication } =
    useApplicationStore()

  // Toast 通知状态
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success',
  })

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      setToast({ isVisible: true, message, type })
    },
    [],
  )

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }, [])

  // 新增弹窗状态
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // 编辑弹窗状态
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null)

  // 删除确认对话框状态
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // 新增投递
  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleAddSubmit = async (data: ApplicationInput) => {
    const result = await addApplication(data)
    setIsAddModalOpen(false)
    if (result) {
      showToast('投递记录添加成功')
    } else {
      showToast('添加失败，请重试', 'error')
    }
  }

  // 编辑投递
  const handleEditClick = (application: Application) => {
    setEditingApplication(application)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingApplication(null)
  }

  const handleEditSubmit = async (data: ApplicationInput) => {
    if (editingApplication) {
      const result = await updateApplication(editingApplication.id, data)
      setIsEditModalOpen(false)
      setEditingApplication(null)
      if (result) {
        showToast('投递记录更新成功')
      } else {
        showToast('更新失败，请重试', 'error')
      }
    }
  }

  // 删除投递
  const handleDeleteClick = (id: string) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deletingId) {
      const success = await deleteApplication(deletingId)
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
      if (success) {
        showToast('投递记录已删除')
      } else {
        showToast('删除失败，请重试', 'error')
      }
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setDeletingId(null)
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <main className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route
              path="/"
              element={
                <ApplicationsPage
                  onAdd={handleAddClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              }
            />
            <Route path="/calendar" element={<SchedulePage />} />
          </Routes>
        </main>

        {/* 新增投递弹窗 */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          title="新增投递"
        >
          <ApplicationForm
            onSubmit={handleAddSubmit}
            onCancel={handleCloseAddModal}
          />
        </Modal>

        {/* 编辑投递弹窗 */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="编辑投递"
        >
          {editingApplication && (
            <ApplicationForm
              initialData={editingApplication}
              onSubmit={handleEditSubmit}
              onCancel={handleCloseEditModal}
            />
          )}
        </Modal>

        {/* 删除确认对话框 */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          title="确认删除"
          message="确定要删除这条投递记录吗？此操作不可撤销。"
        />

        {/* Toast 通知 */}
        <Toast
          isVisible={toast.isVisible}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      </div>
    </BrowserRouter>
  )
}

export default App
