import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initDB } from './lib/db'

// 初始化 IndexedDB 数据库
initDB()
  .then(() => {
    console.log('IndexedDB 初始化成功')
  })
  .catch((error) => {
    console.error('IndexedDB 初始化失败:', error)
  })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
