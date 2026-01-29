import { useEffect } from 'react'
import type { ReactElement } from 'react'
import { useApplicationStore } from '../store/applicationStore'
import FilterBar from '../components/FilterBar'
import ApplicationCard from '../components/ApplicationCard'
import type { Application } from '../lib/types'

interface ApplicationsPageProps {
  onEdit: (application: Application) => void
  onDelete: (id: string) => void
}

export default function ApplicationsPage({
  onEdit,
  onDelete,
}: ApplicationsPageProps): ReactElement {
  const { isLoading, fetchApplications, getFilteredAndSortedApplications } =
    useApplicationStore()

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const filteredApplications = getFilteredAndSortedApplications()

  return (
    <div>
      {/* 筛选栏 */}
      <FilterBar />

      {/* 投递记录列表 */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">暂无投递记录</p>
          <p className="text-gray-400 text-sm mt-1">
            点击右上角「新增投递」按钮开始记录
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
