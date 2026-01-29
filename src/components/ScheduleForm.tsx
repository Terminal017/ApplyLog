// filepath: /Users/raven/code/Apply_Record/ApplyLog/src/components/ScheduleForm.tsx
import { useState, type ReactElement, type FormEvent } from 'react'
import type { Schedule, ScheduleInput } from '../lib/types'

interface ScheduleFormProps {
  initialData?: Schedule
  onSubmit: (data: ScheduleInput) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export default function ScheduleForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ScheduleFormProps): ReactElement {
  const [formData, setFormData] = useState<ScheduleInput>({
    date: initialData?.date ?? new Date().toISOString().split('T')[0],
    time: initialData?.time ?? '09:00',
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    completed: initialData?.completed ?? false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) {
      newErrors.date = '请选择日期'
    }
    if (!formData.time) {
      newErrors.time = '请选择时间'
    }
    if (!formData.title.trim()) {
      newErrors.title = '请输入日程标题'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (
    field: keyof ScheduleInput,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 清除该字段的错误
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 日期 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          日期 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      {/* 时间 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          时间 <span className="text-red-500">*</span>
        </label>
        <input
          type="time"
          value={formData.time}
          onChange={(e) => handleChange('time', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.time && (
          <p className="mt-1 text-sm text-red-500">{errors.time}</p>
        )}
      </div>

      {/* 日程标题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          日程标题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="如：团队周会"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* 日程描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          描述/备注
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="如：会议室A / 预计1小时"
        />
      </div>

      {/* 按钮组 */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '保存中...' : initialData ? '保存修改' : '添加日程'}
        </button>
      </div>
    </form>
  )
}
