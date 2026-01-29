import { useState, type ReactElement, type FormEvent } from 'react'
import type {
  Application,
  ApplicationInput,
  CompanyLevel,
  ApplyChannel,
  ApplicationResult,
} from '../lib/types'

const COMPANY_LEVELS: CompanyLevel[] = ['大厂', '中厂', '小厂', '国企', '外企']
const APPLY_CHANNELS: ApplyChannel[] = ['官网', '内推', '邮箱', '其他']
const APPLICATION_RESULTS: (ApplicationResult | 'null')[] = [
  'null',
  'offer',
  '一面挂',
  '二面挂',
  '三面挂',
  'hr挂',
]

interface ApplicationFormProps {
  initialData?: Application
  onSubmit: (data: ApplicationInput) => void
  onCancel: () => void
}

export default function ApplicationForm({
  initialData,
  onSubmit,
  onCancel,
}: ApplicationFormProps): ReactElement {
  const [formData, setFormData] = useState<ApplicationInput>({
    companyName: initialData?.companyName ?? '',
    jobName: initialData?.jobName ?? '',
    city: initialData?.city ?? '',
    companyLevel: initialData?.companyLevel ?? '大厂',
    applyChannel: initialData?.applyChannel ?? '官网',
    applyLink: initialData?.applyLink ?? '',
    applyDate: initialData?.applyDate ?? new Date().toISOString().split('T')[0],
    processStatus: initialData?.processStatus ?? '投递中',
    record: initialData?.record ?? '',
    result: initialData?.result ?? null,
    remark: initialData?.remark ?? '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) {
      newErrors.companyName = '请输入公司名称'
    }
    if (!formData.jobName.trim()) {
      newErrors.jobName = '请输入岗位名称'
    }
    if (!formData.city.trim()) {
      newErrors.city = '请输入工作城市'
    }
    if (!formData.applyDate) {
      newErrors.applyDate = '请选择投递时间'
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
    field: keyof ApplicationInput,
    value: string | ApplicationResult,
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

  const handleResultChange = (value: string) => {
    const result = value === 'null' ? null : (value as ApplicationResult)
    handleChange('result', result)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 公司名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          公司名称 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => handleChange('companyName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="如：字节跳动"
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
        )}
      </div>

      {/* 岗位名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          岗位名称 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.jobName}
          onChange={(e) => handleChange('jobName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="如：前端开发"
        />
        {errors.jobName && (
          <p className="mt-1 text-sm text-red-500">{errors.jobName}</p>
        )}
      </div>

      {/* 工作城市 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          工作城市 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="如：北京"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-500">{errors.city}</p>
        )}
      </div>

      {/* 公司级别和投递渠道 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            公司级别
          </label>
          <select
            value={formData.companyLevel}
            onChange={(e) =>
              handleChange('companyLevel', e.target.value as CompanyLevel)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {COMPANY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            投递渠道
          </label>
          <select
            value={formData.applyChannel}
            onChange={(e) =>
              handleChange('applyChannel', e.target.value as ApplyChannel)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {APPLY_CHANNELS.map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 投递链接 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          投递链接
        </label>
        <input
          type="url"
          value={formData.applyLink}
          onChange={(e) => handleChange('applyLink', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://..."
        />
      </div>

      {/* 投递时间 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          投递时间 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.applyDate}
          onChange={(e) => handleChange('applyDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.applyDate && (
          <p className="mt-1 text-sm text-red-500">{errors.applyDate}</p>
        )}
      </div>

      {/* 当前流程和投递结果 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            当前流程
          </label>
          <input
            type="text"
            value={formData.processStatus}
            onChange={(e) => handleChange('processStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="如：投递中、一面结束"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            投递结果
          </label>
          <select
            value={formData.result === null ? 'null' : formData.result}
            onChange={(e) => handleResultChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {APPLICATION_RESULTS.map((result) => (
              <option key={result ?? 'null'} value={result ?? 'null'}>
                {result === 'null' ? '流程中' : result}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 信息记录 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          信息记录
        </label>
        <textarea
          value={formData.record}
          onChange={(e) => handleChange('record', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="如：一面 3.1，二面 3.3"
        />
      </div>

      {/* 备注 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          备注
        </label>
        <textarea
          value={formData.remark}
          onChange={(e) => handleChange('remark', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="其他补充说明..."
        />
      </div>

      {/* 按钮 */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          {initialData ? '保存修改' : '添加'}
        </button>
      </div>
    </form>
  )
}
