import './App.css'
import { useState, type ReactElement } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ApplicationsPage from './pages/ApplicationsPage'
import CalendarPage from './pages/CalendarPage'
import Navbar from './components/Navbar'
import Modal from './components/Modal'

function App(): ReactElement {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar onAddClick={handleAddClick} />

        <main className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<ApplicationsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </main>

        {/* 新增投递弹窗（表单组件待实现） */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          title="新增投递"
        >
          <div className="text-gray-500">表单组件开发中...</div>
        </Modal>
      </div>
    </BrowserRouter>
  )
}

export default App
