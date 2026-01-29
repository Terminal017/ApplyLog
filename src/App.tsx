import './App.css'
import { useState, type ReactElement } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ApplicationsPage from './pages/ApplicationsPage'
import CalendarPage from './pages/CalendarPage'
import Navbar from './components/Navbar'
import Modal from './components/Modal'
import ConfirmDialog from './components/ConfirmDialog'
import ApplicationForm from './components/ApplicationForm'
import { useApplicationStore } from './store/applicationStore'
import type { Application, ApplicationInput } from './lib/types'

function App(): ReactElement {
  const { addApplication, updateApplication, deleteApplication } =
    useApplicationStore()

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
    await addApplication(data)
    setIsAddModalOpen(false)
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
      await updateApplication(editingApplication.id, data)
      setIsEditModalOpen(false)
      setEditingApplication(null)
    }
  }

  // 删除投递
  const handleDeleteClick = (id: string) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deletingId) {
      await deleteApplication(deletingId)
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setDeletingId(null)
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar onAddClick={handleAddClick} />

        <main className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <ApplicationsPage
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              }
            />
            <Route path="/calendar" element={<CalendarPage />} />
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
      </div>
    </BrowserRouter>
  )
}

export default App
