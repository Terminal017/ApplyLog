import './App.css'
import type { ReactElement } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ApplicationsPage from './pages/ApplicationsPage'
import CalendarPage from './pages/CalendarPage'

function App(): ReactElement {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-blue-600">
              实习投递追踪系统
            </h1>
            <nav className="space-x-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                投递记录
              </Link>
              <Link
                to="/calendar"
                className="text-gray-700 hover:text-blue-600"
              >
                日程表
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<ApplicationsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
