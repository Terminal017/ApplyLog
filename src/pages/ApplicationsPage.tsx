import { useEffect } from 'react'
import type { ReactElement } from 'react'
import { useApplicationStore } from '../store/applicationStore'

export default function ApplicationsPage(): ReactElement {
  const { applications, isLoading, fetchApplications } = useApplicationStore()

  useEffect(() => {
    fetchApplications()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">投递记录</h2>
      {isLoading ? (
        <div>加载中...</div>
      ) : applications.length === 0 ? (
        <div className="text-gray-500">暂无投递记录，点击新增开始记录。</div>
      ) : (
        <ul className="space-y-2">
          {applications.map((app) => (
            <li key={app.id} className="p-3 bg-white rounded shadow">
              <div className="font-medium text-lg text-blue-600">
                {app.companyName}
              </div>
              <div className="text-sm text-gray-700">
                {app.jobName} · {app.city}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
